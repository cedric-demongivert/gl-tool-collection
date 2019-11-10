/**
* A function that allow to compare two types of objects.
*
* This function must return a number that describe the type of relation between
* the left operand and the right operand. If the returned value is greater than
* zero the left operand is greater than the right one. If the returned value
* is less than zero, the left operand is smaller than the right one. And if the
* returned number is equal to zero the left operand is equal to the right one.
*
* @param left - The value to use as a left operand.
* @param right - The value to use as a right operand.
*
* @return A number that describe the type of relation between the operands.
*/
export type Comparator<Left, Right> = (left : Left, right : Right) => number
