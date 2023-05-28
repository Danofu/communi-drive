export default (...numbers: Array<number>) => numbers.reduce((sum, number) => sum + number, 0) / numbers.length;
