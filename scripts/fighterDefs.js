var fighterDefs={
    mc: {
        imageName: "greenFighter",
        width: 40,
        height: 39,
        xOffset: -5,
        hitboxWidth: 10,
        states: {
            idle: {
                gridPos: [0,0],
                frames: [
                    {duration: 25, movement: 0, cancel: true},
                    {duration: 15, movement: 0, cancel: true},
                    {duration: 15, movement: 0, cancel: true},
                ],
                endState: "idle",
            },
            walk_f: {
                gridPos: [0,6],
                frames: [
                    {duration: 10, movement: 1, cancel: true},
                    {duration: 10, movement: 1, cancel: true},
                ],
                repeatable: true,
                endState: "idle",
            },
            walk_b: {
                gridPos: [0,6],
                frames: [
                    {duration: 10, movement: -1, cancel: true},
                    {duration: 10, movement: -1, cancel: true},
                ],
                repeatable: true,
                endState: "idle",
            },
            attack_top: {
                gridPos: [0,10],
                frames: [
                    {duration: 20, movement: 0, cancel: false},
                    {duration: 40, movement: 0, cancel: false},
                    {duration: 10, movement: 1, cancel: false, attack: {range: 10, damage: 7, type: "top", direction: "f", blockState: "blocked_top"}, z: 2},
                    {duration: 26, movement: 0, cancel: false},
                ],
                endState: "idle",
            },
            blocked_top: {
                gridPos: [2,16],
                frames: [
                    {duration: 5, movement: 0, cancel: false, z: 2},
                    {duration: 15, movement: 0, cancel: false, z: 2},
                    {duration: 15, movement: 0, cancel: false, z: 2},
                ],
                endState: "idle",
            },
            attack_mid: {
                gridPos: [0,12],
                frames: [
                    {duration: 20, movement: 0, cancel: false},
                    {duration: 40, movement: 0, cancel: false},
                    {duration: 10, movement: 1, cancel: false, attack: {range: 15, damage: 4, type: "mid", direction: "f", blockState: "blocked_mid"}, z: 2},
                    {duration: 20, movement: 0, cancel: false},
                ],
                endState: "idle",
            },
            blocked_mid: {
                gridPos: [2,18],
                frames: [
                    {duration: 5, movement: 0, cancel: false, z: 2},
                    {duration: 15, movement: 0, cancel: false, z: 2},
                    {duration: 15, movement: 0, cancel: false, z: 2},
                ],
                endState: "idle",
            },
            attack_bot: {
                gridPos: [0,14],
                frames: [
                    {duration: 20, movement: 0, cancel: false},
                    {duration: 40, movement: 0, cancel: false},
                    {duration: 10, movement: 1, cancel: false, attack: {range: 12, damage: 4, type: "bot", direction: "f", blockState: "blocked_bot"}, z: 2},
                    {duration: 20, movement: 0, cancel: false},
                ],
                endState: "idle",
            },
            blocked_bot: {
                gridPos: [2,20],
                frames: [
                    {duration: 5, movement: 0, cancel: false, z: 2},
                    {duration: 15, movement: 0, cancel: false, z: 2},
                    {duration: 35, movement: 0, cancel: false, z: 2},
                ],
                endState: "idle",
            },
            turn: {
                gridPos: [0,30],
                frames: [
                    {duration: 5, movement: 0, cancel: false},
                ],
                turn: true,
                endState: "idle",
            },
            jump_f: {
                gridPos: [0,26],
                frames: [
                    {duration: 10, movement: 6, cancel: false},
                    {duration: 3, movement: 1, cancel: true},
                    {duration: 4, movement: 1, cancel: true},
                    {duration: 1, movement: 0, cancel: true},
                ],
                endState: "idle",
            },
            jump_b: {
                gridPos: [0,28],
                frames: [
                    {duration: 10, movement: -6, cancel: false},
                    {duration: 3, movement: -1, cancel: true},
                    {duration: 4, movement: -1, cancel: true},
                    {duration: 1, movement: 0, cancel: true},
                ],
                endState: "idle",
            },
            block_top: {
                gridPos: [0,38],
                frames: [
                    {duration: 2, movement: 0, cancel: false, hitboxMod: {top:{block:"f",},mid:{},bot:{}}},
                    {duration: 15, movement: 0, cancel: false, keyToHold: "block", hitboxMod: {top:{block:"f",},mid:{},bot:{}}},
                ],
                blocking: true,
                endState: "idle",
            },
            block_mid: {
                gridPos: [0,34],
                frames: [
                    {duration: 2, movement: 0, cancel: false, hitboxMod: {top:{},mid:{block:"f",},bot:{}}},
                    {duration: 15, movement: 0, cancel: false, keyToHold: "block", hitboxMod: {top:{},mid:{block:"f",},bot:{}}},
                ],
                blocking: true,
                endState: "idle",
            },
            block_bot: {
                gridPos: [0,36],
                frames: [
                    {duration: 2, movement: 0, cancel: false, hitboxMod: {top:{},mid:{},bot:{block:"f",}}},
                    {duration: 15, movement: 0, cancel: false, keyToHold: "block", hitboxMod: {top:{},mid:{},bot:{block:"f",}}},
                ],
                blocking: true,
                endState: "idle",
            },
            kick: {
                gridPos: [0,4],
                frames: [
                    {duration: 10, movement: -1, cancel: false},
                    {duration: 20, movement: 0, cancel: false},
                    {duration: 10, movement: 0, cancel: true},
                ],
                endState: "idle",
            },
            roll: {
                gridPos: [0,2],
                frames: [
                    {duration: 10, movement: 7, cancel: false, noCollide: true},
                    {duration: 10, movement: 9, cancel: false, noCollide: true},
                    {duration: 10, movement: 7, cancel: false, noCollide: true, hitboxMod: {top:{},mid:{miss:true},bot:{miss:true}}},
                ],
                endState: "idle",
            },
            matrix: {
                gridPos: [0,22],
                frames: [
                    {duration: 5, movement: 0, cancel: false, hitboxMod: {top:{shift:-8},mid:{shift:-4},bot:{}}},
                    {duration: 10, movement: 0, cancel: false, keyToHold: "pull", hitboxMod: {top:{shift:-12},mid:{shift:-10},bot:{}}},
                    {duration: 10, movement: 0, cancel: true},
                ],
                endState: "idle",
            },
            flourish: {
                gridPos: [0,24],
                frames: [
                    {duration: 10, movement: 0, cancel: false},
                    {duration: 10, movement: 0, cancel: false},
                    {duration: 10, movement: 0, cancel: false},
                    {duration: 10, movement: 0, cancel: false},
                ],
                endState: "idle",
            },
            damage: {
                gridPos: [0,8],
                frames: [
                    {duration: 10, movement: 0, cancel: false},
                    {duration: 15, movement: 0, cancel: false},
                ],
                endState: "idle",
            },
            dying: {
                gridPos: [0,40],
                frames: [
                    {duration: 30, movement: 0, cancel: false,noCollide: true,z:0},
                    {duration: 15, movement: 0, cancel: false,noCollide: true,z:0},
                    {duration: 20, movement: 0, cancel: false,noCollide: true,z:0},
                    {duration: 10, movement: 0, cancel: false,noCollide: true,z:0},
                ],
                endState: "dead",
            },
            dead: {
                gridPos: [0,42],
                frames: [
                    {duration: 30, movement: 0, cancel: false,noCollide: true,z:0},
                ],
                endState: "dead",
            },
        }
    }
}