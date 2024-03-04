import * as board from './board.mjs'
import {classify, FINGER_MAP} from './classify.mjs'

const FINGERS = ['LP', 'LR', 'LM', 'LI', 'LT', 'RT', 'RI', 'RM', 'RR', 'RP']

let MONOGRAMS = null
let BIGRAMS = null
let SKIPGRAMS = null
let TRIGRAMS = null

export async function init() {
    MONOGRAMS = await (await fetch('corpora/monograms.json')).json()
    BIGRAMS = await (await fetch('corpora/bigrams.json')).json()
    SKIPGRAMS = await (await fetch('corpora/skipgrams.json')).json()
    TRIGRAMS = await (await fetch('corpora/trigrams.json')).json()
}

function keypos(idx) {
    let row = null
    let col = idx % 10
    if (idx >= 0 && idx < 10) {
        row = 0
    } else if (idx >= 10 && idx < 20) {
        row = 1
        col += 0.25
    } else if (idx >= 20 && idx < 30) {
        row = 2
        col += 0.75
    }
    if (idx === 29) {
        row = 1
        col += 0.5
    }
    return [row, col]
}

function twokeydist(k1, k2) {
    let p1 = keypos(k1)
    let p2 = keypos(k2)
    return Math.sqrt(Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2))
}

export function analyze() {
    const letters = board.layout()
    const layout = {}

    for (let i=0; i < letters.length; i++) {
        layout[letters[i]] = i
    }

    const res = {}
    for (const suffix of ['B', 'S', '']) {
        let grams

        switch (suffix) {
            case 'B':
                grams = BIGRAMS
                break
            case 'S':
                grams = SKIPGRAMS
                break
            default:
                grams = TRIGRAMS
                break
        }

        let curr = {}
        let total = 0

        for (let [gram, count] of Object.entries(grams)) {
            const key = [...gram].map(x => layout[x])
            
            if (key.indexOf(undefined) !== -1) {
                continue
            }

            total += count
            
            const stats = classify(key)

            for (let stat_ of stats) {
                let stat = stat_ + suffix
                let dist = twokeydist(key[0], key[1])
                // let dist = 1
                
                curr[stat] ??= 0

                if (key.length === 2) {
                    if (stat_ === "LS") {
                        curr[stat] += count * dist
                    } else if (stat_ === "SF") {
                        curr[stat] += count * dist
                    } else {
                        curr[stat] += count
                    }
                } else {
                    curr[stat] += count
                }
                // curr[stat] += count
            }
        }

        for (const [stat, count] of Object.entries(curr)) {
            res[stat] = count / total
        }
    }

    let curr = {}
    let total = 0

    for (const [gram, count] of Object.entries(MONOGRAMS)) {
        const finger = FINGERS[FINGER_MAP[layout[gram]]]

        if (finger === undefined) {
            continue
        }

        curr[finger] ??= 0
        curr[finger] += count
        total += count
    }

    for (const [stat, count] of Object.entries(curr)) {
        res[stat] = count / total
    }

    res['LH'] = ['LI', 'LM', 'LR', 'LP', 'LT'].reduce((sum, x) => sum + (res[x] ?? 0), 0)
    res['RH'] = ['RI', 'RM', 'RR', 'RP', 'RT'].reduce((sum, x) => sum + (res[x] ?? 0), 0)

    return res
}