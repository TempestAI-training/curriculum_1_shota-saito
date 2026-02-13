const N = Number(window.prompt("自然数を入力してください"));

let evenSum = 0;
let oddSum = 0;

for (let i = 1; i <= N; i++) {
    if (i % 2 === 0) {
        evenSum += i; 
    } else {
        oddSum += i;
    }
}

const diff = Math.abs(evenSum - oddSum);

document.write("入力された数 N: " + N + "<br>");
document.write("偶数の和: " + evenSum + "<br>");
document.write("奇数の和: " + oddSum + "<br>");
document.write("差分の絶対値: " + diff);