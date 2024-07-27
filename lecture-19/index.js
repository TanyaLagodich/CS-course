// Необходимо написать функцию, которая бы принимала бы строку и "схлопывала" бы все подряд идущие повторения

const zipStr = (str) => str.replace(/(.)\1+/g, '$1');
console.log(zipStr('abbaabbafffbezza')); // ababafbeza


// Необходимо написать функцию, которая бы удаляла из строки все не уникальные символы
const unique = (str) => {
    return str.replace(/(\w)/g, (char) => {
        return str.match(new RegExp(char, 'g')).length > 1 ? '' : char;
    })
}
console.log(unique('abaceffgw')); // bcegw


// Необходимо написать функцию, которая бы находила в строке любые числа обозначающие деньги
const findMoney = (str) => {
    return str.match(/(\d[\d\s]*)[.|,]?\d*[\u0024|\u20A0-\u20CF]/g);
}


// ['100 00,53$', '500₽']
console.log(findMoney(`20.10.2020 Федор взял у меня 100 00,53$ и обещался вернуть не поздее 25 числа, но уже через 2 дня, он занял еще 500₽`));
