function Block(positionArr, color, score, centercoord, blockcoords, rotationwise, rotcnt) {
    Debugger.log("Block");
    this.prevpositionArr = [];
    (positionArr === undefined) ? this.positionArr = [] : this.positionArr = positionArr;
    //[row,row,row]=>[[[col],[col],[col]],[[col],[col],[col]]]
    (color === undefined) ? this.color = "#000000": this.color = color;
    (score === undefined) ? this.score = 0: this.score = score;
    (rotationwise === undefined) ? this.rotationwise = 0: this.rotationwise = rotationwise;
    if (rotationwise == Game.ONEWISE) {
        (rotcnt === undefined) ? this.rotcnt = 0: this.rotcnt = rotcnt;
    }
    (centercoord === undefined) ? this.centercoord = {
        x: 0,
        y: 0
    }: this.centercoord = centercoord;
    (blockcoords === undefined) ? this.blockcoords = {
        x: 0,
        y: 0
    }: this.blockcoords = blockcoords;
    this.height = positionArr.length;
    this.width = positionArr[0].length;
    this.getpositionflow = function() {
        var arrFlow = [];
        for (i = 0; i < this.positionArr.length; i++) {
            //Rows
            for (j = 0; j < this.positionArr[i].length; j++) {
                //Colls
                arrFlow.push(this.positionArr[i][j]);
            }
        }
        return arrFlow;
    }
    this.rotate90degrees = function(cwORccw) {
        this.prevpositionArr = this.positionArr;
        if (cwORccw == 0) {
            var totalArr = [];
            for (var i = 0; i < this.width; i++) {
                var row = [];
                for (var j = this.height - 1; j >= 0; j--) {
                    var col = this.positionArr[j][i];
                    row.push(col);
                }
                totalArr.push(row);
            }
            this.positionArr = totalArr;
        }
        else if (cwORccw == 1) {
            var totalArr = [];
            for (var i = this.width - 1; i >= 0; i--) {
                var row = [];
                for (var j = 0; j < this.height; j++) {
                    var col = this.positionArr[j][i];
                    row.push(col);
                }
                totalArr.push(row);
            }
            this.positionArr = totalArr;
        }
    }
}
Block.prototype.rotate = function() {
    switch (this.rotationwise) {
    case Game.CLOCKWISE:
        this.rotate90degrees(0);
        break;
    case Game.COUNTERCLOCKWISE:
        this.rotate90degrees(1);
        break;
    case Game.NOWISE:
        break;
    case Game.ONEWISE:
        this.rotate90degrees(this.rotcnt % 2);
        this.rotcnt++;
        break;
    default:
        break;
    }
    this.height = this.positionArr.length;
    this.width = this.positionArr[0].length;
}
Block.prototype.reRotate = function() {
    this.positionArr = this.prevpositionArr;
}
Block.prototype.draw = function(contextperview) {
    contextperview.beginPath();
    for (i = 0; i < this.positionArr.length; i++) {
        //Rows
        for (j = 0; j < this.positionArr[i].length; j++) {
            //Colls
            if (this.positionArr[i][j] == 1) {
                //Draw
                contextperview.fillStyle = this.color;
                contextperview.fillRect((this.blockcoords.x * Game.BLOCKWIDTHHEIGHT) + (j * Game.BLOCKWIDTHHEIGHT) + Game.BLOCKOFFSET, (this.blockcoords.y * Game.BLOCKWIDTHHEIGHT) + (i * Game.BLOCKWIDTHHEIGHT) + Game.BLOCKOFFSET, Game.BLOCKWIDTHHEIGHT - (Game.BLOCKOFFSET * 2), Game.BLOCKWIDTHHEIGHT - (Game.BLOCKOFFSET * 2));
                contextperview.clearRect((this.blockcoords.x * Game.BLOCKWIDTHHEIGHT) + (j * Game.BLOCKWIDTHHEIGHT) + Game.BLOCKCLEARRECTWIDTHHEIGHT, (this.blockcoords.y * Game.BLOCKWIDTHHEIGHT) + (i * Game.BLOCKWIDTHHEIGHT) + Game.BLOCKCLEARRECTWIDTHHEIGHT, Game.BLOCKCLEARRECTWIDTHHEIGHT, Game.BLOCKCLEARRECTWIDTHHEIGHT);
            }
        }
    }
}
Block.prototype.move = function(x, y) {
    this.blockcoords.x = x;
    this.blockcoords.y = y;
}
Block.prototype.getpieces = function() {
    var arrRet = [];
    for (i = 0; i < this.positionArr.length; i++) {
        //Rows
        for (j = 0; j < this.positionArr[i].length; j++) {
            //Colls
            if (this.positionArr[i][j] == 1) {
                var piece = {
                    x: this.blockcoords.x + j,
                    y: this.blockcoords.y + i,
                    color: this.color
                };
                arrRet.push(piece);
            }
        }
    }
    return arrRet;
}
Block.prototype.getCurrentYs = function() {
    var arrRet = [];
    for (i = 0; i < this.positionArr.length; i++) {
        //Rows
        for (j = 0; j < this.positionArr[i].length; j++) {
            //Colls
            if (this.positionArr[i][j] == 1) {
                if (!arrayContains(arrRet, this.blockcoords.y + i)) arrRet.push(this.blockcoords.y + i);
            }
        }
    }
    return arrRet;
}
Block.prototype.getCalculatedScore = function() {
    var retScore = 0;
    var m = Math.ceil((Math.abs(this.blockcoords.y - Game.PLAYFIELDHEIGHT) / Game.PLAYFIELDSCORESEPPARATOR));
    retScore = this.score * m;
    return {
        score: retScore,
        multiplier: m,
        blockscore: this.score
    };
}
Block.prototype.traceblockPositions = function() {
    //	Debugger.log("BLOCKPOSITION:");
    var str = "";
    for (i = 0; i < this.positionArr.length; i++) {
        //Rows
        str += "[";
        for (j = 0; j < this.positionArr[i].length; j++) {
            var piece = {
                x: this.blockcoords.x + j,
                y: this.blockcoords.y + i,
                color: this.color
            };
            var json = JSON.stringify(piece);
            str += json;
        }
        str += "],";
    }
    //	Debugger.log(str);
}