// var name = " mac ";
// var age = 22;
// var hobby = true;
// function okuser(uname, uage, uhobby) {
//   console.log(
//     "user has naame " +
//       uname +
//       "user have age " +
//       uage +
//       "user has hobby" +
//       uhobby
//   );
// }

// okuser(name, age, hobby);

// ********************************************************************************************

// LET AND CONST
// const name = " mac ";
// let age = 22;
// const hobby = true;

// function okuser(uname, uage, uhobby) {
//   console.log(
//     "user has naame " +
//       uname +
//       "user have age " +
//       uage +
//       "user has hobby" +
//       uhobby
//   );
// }

// okuser(name, age, hobby);

//********************************************************************************* */
//OBJECT

// const person = {
//   name: "ravi",
//   age: 12,
//   greet() {
//     console.log("hi i am" + this.name);
//   },
// };
//ARRAY
// const hobbys = ["ravisir", 1, "cooking"];

// for (let hobby of hobbys) {
//   console.log(hobby);
// }

// console.log(
//   hobbys.map((hobby) => {
//     return "hobby :" + hobby;
//   })
// );
// console.log(hobbys);

//**************************************************************************************** */

//REST AND SPREAD OPERATORS

//spread
const hobbys = ["ravisir", 1, "cooking"];
const newarr = [...hobbys];
console.log(newarr);

//rest

const array = (...args) => {
  return args;
};

console.log(array(1, 2, 3, 4));

//**************************************************************** */

//DESTRUCTURING
const person = {
  name: "ravi",
  age: 12,
  greet() {
    console.log("hi i am" + this.name);
  },
};

const printname = ({ name }) => {
  return name;
};

console.log(printname(person));

const { name, age } = person;
console.log(name, age);

//ARRAY DESTRUCTURING

const hooby = ["ok", "not ok"];

const [element1, element2] = hooby;
console.log(element1, element2);
