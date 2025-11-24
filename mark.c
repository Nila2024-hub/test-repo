// #include <stdio.h>
// int main(){
//     int age;
//     printf("Enter your age: ");
//     scanf("%d", &age);

//     if( age >= 18){
//         printf("Adult\n");
//     }
//     else{
//         printf("Child\n");
//     }

//     printf("Thank You^^");
//     return 0;#
// }

// #include <stdio.h>
// int main(){
//     int x = 10;
//     printf("%d\n", x += 5);   // x = x + 5
//     printf("%d\n", x *= 2);   //x = new x * 2
//     printf("%d\n", x /= 5);
//     printf("%d\n", x %= 5);

//     return 0;
// }

// #include <stdio.h>
// int main(){
//     int a = 5, b = 5;
//     printf("Initial state a : %d  b : %d \n", a,b);
//     printf("After using the operator a: %d, b : %d\n", ++a, b++);  // if ++ or -- is before = change first
//     printf("Result after operation a: %d, b : %d\n", a,b);        // if ++ or -- is after = use it first
//     return 0;
// }
// #include <stdio.h>
// int main(){
//     int a = 3;
//     int b = a++ + a++ + ++a;
//     printf("%d\n%d", a, b);
//     return 0;
// }

// #include <stdio.h>
// int main(){
//     int a = 5;
//     int b = a++ + ++a;
//     printf("%d\n%d", a,b);
//     return 0;               #output: 7, 12
// }

// #include <stdio.h>
// int main(){
//     int a = 10;
//     int b = --a + a--;
//     printf("%d\n%d", a,b);
//     return 0;                #output : 8, 17
// }

// #include <stdio.h>
// int main(){
//     int a =3;
//     int b = a++ + a+++ ++a;
//     printf("%d\n%d", a,b);
//     return 0;
// } 

// #include<stdio.h>
// int main(){
//     int a = 5;
//     printf("%d\n", a++ * ++a);
//     return 0;                  output: 30
// }

// #include<stdio.h>
// int main(){
//     int a = 7;
//     int b = a-- - --a + ++a + a++;
//     printf("%d %d", a, b);

//     return 0;

// }
// #include<stdio.h>
// int main(){
//     int a = 7;
    
//     printf("%d", --a);

//     return 0;

// }
// #include <stdio.h>
// int main(){
//     int a = 5, b;
//     printf("Before a : %d\n", a);   //a = 5

//     b = ++a * ++a;    //++a, ++a, b =a* a
//     printf("after a : %d, b: %d\n", a,b);   //a = 
//     return 0;
// }
// #include <stdio.h>
// int main(){
//     int x = 8, y = 7, a = 6, b = 5;
//     int re1 = 0, re2 = 0, re3 = 0;

//     re1 = ++x * 10;
//     re2 = y++ * 10;
//     re3 = a++ + --b;

//     printf("re1 = %d\n", re1);  //re1 = 9 * 10 = 90 , x = 9
//     printf("re2 = %d\n", re2); //re2 = 7 * 10 = 70  , y = 8
//     printf("re3 = %d\n", re3); //re3 = 6 + 4 = 10  ,  a = 7 , b = 4
//     printf("x = %d\n", x);   // x = 9
//     printf("y = %d\n", y);  // y = 8
//     printf("a = %d\n", a);  //a= 7    
//     printf("b = %d\n", b); // b = 3 
//     return 0;
// }

// #include <stdio.h>
// int main(){
//     int a = 3, b = 4, r1,r2;

//     r1 = ++a + b++;
//     r2 = a++ + --b;

//     printf("r1 = %d\n", r1);
//     printf("r2 = %d\n",r2);
//     printf("a = %d, b = %d\n", a, b);     
//     return 0;
// } 

// #include <stdio.h>
// int main(){
//     int x = 10, y = 5, r;

//     r = x -- * ++y;
//     r = ++x + y--;

//     printf("r = %d\n",r);
//     printf("x = %d, y = %d\n", x, y);
//     return 0;
// }

// #include <stdio.h>
// int main(){
//     int m = 2, n = 3, p;

//     p = m++ + n++;
//     p = ++m * --n;

//     printf("p = %d\n", p);
//     printf("m = %d, n = %d\n", m ,n);
//     return 0;
// }
// #include <stdio.h>
// int main(){
//     int a = 5, b = 5;
//     printf("%d\n%d\n", a, b);
//     printf("%d\n%d\n", ++a, b++);
//     printf("%d\n%d\n", a,b);
//     return 0;
// } 

// #include <stdio.h>
// int main(){
//     int a = 5, b;
//     printf("%d\n", a);

//     b = ++a * ++a;

//     printf("%d\n%d", a,b);
//     return 0;
// }

#include <stdio.h>
int main(){
    int num = 17;

    printf("%d\n", ++num);
    printf("%d\n", num++);
    printf("%d\n", --num);
    printf("%d\n", num++);
    printf("%d\n", num--);
    return 0;
}
// #include<stdio.h>
// int main(){
//     int a =5, b;
//     printf("%d",a);

//     b = ++a * a++; 

//     printf(" a : %d, b: %d\n", a,b);
//     return 0;
// }    
// 7 , 42 
// #include<stdio.h>
// int main(){
//     int a =5, b;
//     printf("%d",a);

//     b = ++a * ++a; 

//     printf(" a : %d, b: %d\n", a,b);
//     return 0;
// } 
// 7, 49 