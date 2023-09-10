ThemeHotChiliChipValueGenerator = cc.Class({
    ctor() {
    },
    calculate(num, divideN, numOfDecimalDigits) {
        if (!num) return '';

        if (!divideN) {
            return num.toString();
        } else if (divideN <= 0) {
            return '';
        }

        let decimalDigits;
        if (num % divideN === 0) {
            decimalDigits = 0;
        } else {
            decimalDigits = numOfDecimalDigits;
        }
        const form = '%.' + decimalDigits + 'f';
        let nn = Math.floor(10 * num / divideN) / 10;
        nn = nn.toFixed(decimalDigits);
        
        return nn.toString();
    },

    stringify(num) {
        if (!num) return '';
    
        if (num >= 1e12) {
            if (num >= 1e14) {
                return Math.floor(num / 1e12).toString() + 'T';
            } else {
                const a = this.calculate(num, 1e12, 1);
                const b = this.calculate(num, 1e12, 0);
                const c = this.calculate(parseFloat(a) - parseFloat(b), 1, 1);
    
                if (parseFloat(c) === 0) {
                    return this.calculate(parseFloat(b), 1, 0).toString() + 'T';
                } else {
                   return this.calculate(parseFloat(a), 1, 1).toString() + 'T';
                }
            }
        } else if (num >= 1e9) {
            if (num >= 1e11) {
                return Math.floor(num / 1e9).toString() + 'B';
            } else {
                const a = this.calculate(num, 1e9, 1);
                const b = this.calculate(num, 1e9, 0);
                const c = this.calculate(parseFloat(a) - parseFloat(b), 1, 1);
    
                if (parseFloat(c) === 0) {
                    return this.calculate(parseFloat(b), 1, 0).toString() + 'B';
                } else {
                    return this.calculate(parseFloat(a), 1, 1).toString() + 'B';
                }
            }
        } else if (num >= 1e6) {
            if (num >= 1e8) {
                return Math.floor(num / 1e6).toString() + 'M';
            } else {
                const a = this.calculate(num, 1e6, 1);
                const b = this.calculate(num, 1e6, 0);
                const c = this.calculate(parseFloat(a) - parseFloat(b), 1, 1);
    
                if (parseFloat(c) === 0) {
                    return this.calculate(parseFloat(b), 1, 0).toString() + 'M';
                } else {
                    return this.calculate(parseFloat(a), 1, 1).toString() + 'M';
                }
            }
        } else if (num >= 1e3) {
            if (num >= 1e5) {
                return Math.floor(num / 1e3).toString() + 'K';
            } else {
                const a = this.calculate(num, 1e3, 1);
                const b = this.calculate(num, 1e3, 0);
                const c = this.calculate(parseFloat(a) - parseFloat(b), 1, 1);
    
                if (parseFloat(c) === 0) {
                    return this.calculate(parseFloat(b), 1, 0).toString() + 'K';
                } else {
                    return this.calculate(parseFloat(a), 1, 1).toString() + 'K';
                }
            }
        } else {
            return num.toString();
        }
    },

    pickAValueStr(mode) {
        const chooseFromList = (mode === 0) ? ThemeHotChili.ChipValueMultipleList : null;
        let mIdx = null;
    
        let retryTime = 0;
        while (retryTime === 0 || (mIdx === chooseFromList.length - 1 && retryTime < 2)) {
            mIdx = Math.floor(Math.random() * chooseFromList.length);
            mIdx = Math.min(mIdx, chooseFromList.length - 1);
            retryTime++;
        }
    
        const multiplier = chooseFromList[mIdx];
        if (multiplier < 0) {
            return (multiplier + 1).toString();
        } else {
            const v = multiplier * ThemeHotChili.ctl.getCurTotalBet();
            return this.stringify(v);
        }
    },
    
    index2ValueStr(index, multiNum) {
        if (index < 18) {
            index = 18;
        }
    
        const v = ThemeHotChili.SymbolChipValueList[index + 1] * ThemeHotChili.ctl.getCurTotalBet() * multiNum;
        return this.stringify(v);
    }
    

    


});
