export const STANDARD = [
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    5, 5, 5
]

export const ANGLE = [
    0, 1, 2, 2, 3, 6, 6, 7, 8, 9,
    0, 1, 2, 3, 3, 6, 6, 7, 8, 9,
    0, 2, 3, 3, 3, 6, 6, 7, 8, 9,
    5, 5, 5
]

const STAGGER = true

export let FINGER_MAP = STANDARD

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

export function angle(bool) {
    if (bool) {
        FINGER_MAP = ANGLE
    } else {
        FINGER_MAP = STANDARD
    }

    console.log(`angle: ${bool}`)
}

function finger(idx) {
    return FINGER_MAP[idx]
}

function justfinger(idx) {
    if (FINGER_MAP[idx] < 5) {
        return FINGER_MAP[idx]
    } else {
        return FINGER_MAP[idx] - ((FINGER_MAP[idx] % 5) * 2 + 1)
    }
}

function column(idx) {
    if (idx >= 30) {
        return 0
    } 
    
    return idx % 10
}

function hand(idx) {
    if (idx >= 30) {
        return 1
    } 

    if (idx % 10 < 5) {
        return 0
    } else {
        return 1
    }
}

function row(idx) {
    return Math.floor(idx / 10)
}

function ordered(idx) {
    return (
        (
            finger(idx[0]) < finger(idx[1]) &&
            finger(idx[1]) < finger(idx[2])
        ) ||
        (
            finger(idx[0]) > finger(idx[1]) &&
            finger(idx[1]) > finger(idx[2])
        )
    )
}

export function classify(key) {
    switch(key.length) {
        case 2:
            return bigrams(key)
        case 3:
            return trigrams(key)
    }
}

function bigrams(key) {
    const buckets = []

    if (
        finger(key[0]) == finger(key[1]) &&
        key[0] != key[1]
    ) {
        buckets.push('SF')
        return buckets
    }
    
    if (hand(key[0]) === hand(key[1])) {
        if (Math.abs(justfinger(key[0]) - justfinger(key[1])) === 1) {
            const d1 = keypos(key[0])
            const d2 = keypos(key[1])
            if (Math.abs(d1[1] - d2[1]) > 1.5) {
                // if (key[0] === 25 && key[1] === 17) {
                // }
                console.log('LS',key[0],key[1])
                buckets.push('LS')
            }
        }



        // if (FINGER_MAP === STANDARD) {
        //     if (
        //         (
        //             [4, 5].includes(column(key[0])) ||
        //             [4, 5].includes(column(key[1]))
        //         ) &&
        //         (
        //             [2, 7].includes(column(key[0])) ||
        //             [2, 7].includes(column(key[1]))
        //         )
        //     ) {
        //         buckets.push('LS')
        //     }
        // } else if (FINGER_MAP === ANGLE) {
        //     if (
        //         (
        //             [4, 5].includes(column(key[0])) ||
        //             [4, 5].includes(column(key[1]))
        //         ) &&
        //         (
        //             [2, 7].includes(column(key[0])) ||
        //             [2, 7].includes(column(key[1]))
        //         )
        //     ) {
        //         buckets.push('LS')
        //     } else if (
        //         (
        //             key[0] === 21 && [4,14,23,24].includes(key[1])
        //         ) ||
        //         (
        //             [4,14,23,24].includes(key[0]) && key[1] === 21
        //         ) 
        //     ) {

        //         buckets.push('LS')
        //     }
        // }

    }

    // if (
    //     (
    //         row(key[1]) - row(key[0]) == -1 &&
    //         hand(key[0]) == hand(key[1]) &&
    //         [1, 2, 7, 8].includes(finger(key[1]))
    //     ) ||
    //     (
    //         row(key[1]) - row(key[0]) == 1 &&
    //         hand(key[0]) == hand(key[1]) &&
    //         [1, 2, 7, 8].includes(finger(key[0]))
    //     )
    // ) {
    //     buckets.push('HS')
    // }

    if (hand(key[0]) == hand(key[1])) {
        if (justfinger(key[0]) == 0 && justfinger(key[1]) == 1) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('FS')
            } else if (row(key[1]) - row(key[0]) == -1) {
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('FS')
            }
        } else if (justfinger(key[0]) == 0 && justfinger(key[1]) == 2) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == -1) {
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('FS')
            }
        } else if (justfinger(key[0]) == 0 && justfinger(key[1]) == 3) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('FS')
            } else if (row(key[1]) - row(key[0]) == -1) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
            } else if (row(key[1]) - row(key[0]) == 2) {
            }
        } else if (justfinger(key[0]) == 1 && justfinger(key[1]) == 0) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('FS')
            } else if (row(key[1]) - row(key[0]) == -1) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('FS')
            }
        } else if (justfinger(key[0]) == 1 && justfinger(key[1]) == 2) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('FS')
            } else if (row(key[1]) - row(key[0]) == -1) {
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('FS')
            }
        } else if (justfinger(key[0]) == 1 && justfinger(key[1]) == 3) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('FS')
            } else if (row(key[1]) - row(key[0]) == -1) {
                buckets.push(buckets.includes('LS') ? 'FS' : 'HS')
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
            } else if (row(key[1]) - row(key[0]) == 2) {
                if (STAGGER && key[1] == 24) {
                    buckets.push('FS')
                } else if (STAGGER && key[1] == 23) {
                    buckets.push('HS')
                }
            }
        } else if (justfinger(key[0]) == 2 && justfinger(key[1]) == 0) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('FS')
            } else if (row(key[1]) - row(key[0]) == -1) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('HS')
            }
        } else if (justfinger(key[0]) == 2 && justfinger(key[1]) == 1) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('FS')
            } else if (row(key[1]) - row(key[0]) == -1) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('FS')
            }
        } else if (justfinger(key[0]) == 2 && justfinger(key[1]) == 3) {
            if (row(key[1]) - row(key[0]) == -2) {
                buckets.push('FS')
            } else if (row(key[1]) - row(key[0]) == -1) {
                buckets.push(buckets.includes('LS') ? 'FS' : 'HS')
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
                if (STAGGER && hand(key[0] == 0) && buckets.includes('LS')) {
                    buckets.push('FS')
                }
            } else if (row(key[1]) - row(key[0]) == 2) {
                if (STAGGER && hand(key[0] == 0)) {
                    if (buckets.includes('LS')) {
                        buckets.push('FS')    
                    }
                    else {
                        buckets.push('HS')
                    }
                }
            }
        } else if (justfinger(key[0]) == 3 && justfinger(key[1]) == 0) {
            if (row(key[1]) - row(key[0]) == -2) {
            } else if (row(key[1]) - row(key[0]) == -1) {
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
                buckets.push('HS')
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('FS')
            }
        } else if (justfinger(key[0]) == 3 && justfinger(key[1]) == 1) {
            if (row(key[1]) - row(key[0]) == -2) {
                if (STAGGER && key[0] == 24) {
                    console.log("asdfjkl;")
                    buckets.push('FS')
                } else if (STAGGER && key[0] == 23) {
                    console.log("ineahtsr")
                    buckets.push('HS')
                }
            } else if (row(key[1]) - row(key[0]) == -1) {
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
                buckets.push(buckets.includes('LS') ? 'FS' : 'HS')
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('FS')
            }
        } else if (justfinger(key[0]) == 3 && justfinger(key[1]) == 2) {
            if (row(key[1]) - row(key[0]) == -2) {
                if (STAGGER && hand(key[0] == 0)) {
                    if (buckets.includes('LS')) {
                        buckets.push('FS')    
                    }
                    else {
                        buckets.push('HS')
                    }
                }
            } else if (row(key[1]) - row(key[0]) == -1) {
                if (STAGGER && hand(key[0] == 0) && buckets.includes('LS')) {
                    buckets.push('FS')
                }
            } else if (row(key[1]) - row(key[0]) == 0) {
                // buckets.push('SR')
            } else if (row(key[1]) - row(key[0]) == 1) {
                buckets.push(buckets.includes('LS') ? 'FS' : 'HS')
            } else if (row(key[1]) - row(key[0]) == 2) {
                buckets.push('FS')
            }
        }
    }

    // if (
    //     (
    //         row(key[1]) - row(key[0]) == -2 &&
    //         hand(key[0]) == hand(key[1]) &&
    //         [1, 2, 7, 8].includes(finger(key[1]))
    //     ) ||
    //     (
    //         row(key[1]) - row(key[0]) == 2 &&
    //         hand(key[0]) == hand(key[1]) &&
    //         [1, 2, 7, 8].includes(finger(key[0]))
    //     )
    // ) {
    //     buckets.push('FS')
    // }

    return buckets
}

function trigrams(key) {
    const buckets = []

    if (
        hand(key[0]) == hand(key[2]) &&
        hand(key[0]) != hand(key[1])
    ) {
        buckets.push('ALT')
    }

    if (
        new Set(key.map(x => hand(x))).size == 2 &&
        new Set(key.map(x => finger(x))).size == 3 &&
        hand(key[0]) != hand(key[2])
    ) {
        buckets.push('ROL')
    }

    if (
        new Set(key.map(x => hand(x))).size == 1 &&
        ordered(key)
    ) {
        buckets.push('ONE')
    }

    if (
        new Set(key.map(x => hand(x))).size == 1 &&
        new Set(key.map(x => finger(x))).size == 3 &&
        !ordered(key)
    ) {
        buckets.push('RED')
    }

    return buckets
}