export var addZero = function(val: string | number) {
    return Number(val) < 10 ? `0${val}` : val.toString();
  }