// #include<stdio.h>
// int main(){
//     //for(initialisation; condition; updation)
//     for( int i =1; i <= 5; i += 1){        //starting: i = 1, condition: 1 < 5=true,printf,updation: 1+1=2->2 <=5 -> true->printf
//         printf(" Hello ^^ Nila!! \n");
//     }
//     return 0;
// }

//print the number from 1 ~ 100
// #include<stdio.h>
// int main(){
//     //for(initialisation; condition; updation)
//     for( int i =1; i <= 100; i += 1){        //starting: i = 1, condition: 1 < 5=true,printf,updation: 1+1=2->2 <=5 -> true->printf
//         printf("%d\n", i);
//     }
//     return 0;
// }

//print the values from 10 ~ 1
// #include<stdio.h>
// int main(){
//     for(int i = 10; i>=1; i -= 1){     //iteration
//         printf("%d\n", i);
//     }
//     return 0;
// }

//print the numbers from 0~10
// #include <stdio.h>
// int main(){               // i = i+1, i ++ -> i+1  
//     for( int i = 0; i<=10; i += 1){
//         printf("%d\n", i);
//     }
//     return 0;
// }

//print the numbers from 0 to n, if n is given by user 

// #include<stdio.h>
// int  main(){
//     int i, num;
//     printf("Input the number by the user: ");
//     scanf("%d", &num);

//     for( i = 0; i <= num; i++){
//         printf("%d\n", i);
//     }
//     return 0;
// }

//increment operator( pre-increment , post-increment)
//i++ = first use then change
//++i = first change then use
// #include <stdio.h>
// int main(){
//      int i = 1;
//     printf("%d", i++);   //output is 1, new a would be 2
//     return 0;
// }

//pre-increment 
// #include<stdio.h>
// int main(){
//     int i = 1;
//     printf("%d\n%d", i++, i);  //first use then change
    
//     return 0;
// } 

//post-increment
//#include<stdio.h>
// int main(){
//     int i = 1;
//     printf("post increment : %d\n", ++i); //first change then use
//     printf(" new i after post- increment is : %d\n", i);
//     return 0;
// }
// //output: 2 -> first it changed(++i = 1+1= 2) then the new i it use which is 2. 

//Class images 
// #include <stdio.h>
// int main(){
//     int i ,limit;

//     printf("Enter the number : ");
//     scanf("%d", &limit);

//     for( i = 1; i <= limit; i++){
//         printf("%d\n", i);

//     }
//     return 0;
// }

// #include<stdio.h>
// int main(){
//     for(int i = 1 ; i <= 5; i++){
//         printf("*");
//     }
//     return 0;
// }

//print the Sum of First n Natural Numbers.
// #include<stdio.h>
// int main(){
//     int num, sum;
//     printf("Enter the number : ");
//     scanf("%d", &num);

//     sum = 0;
//     for(int i = 1; i <= num; i ++){
//         printf("The sum of the %d natural numbers is : %d\n", i, sum = sum + i);
//     }
//     return 0;    
// }
//print the sum of the first n natural numbers in reverse.
// #include<stdio.h>
// int main(){
//     int num, sum;
//     printf("Enter the number: ");
//     scanf("%d", &num);
//     sum = 0;
//     for ( int i = num; i >=1 ; i--){
//         printf("The sum of the %d in reverse is: %d\n", i, sum = sum + i);
//     }

//     return 0;
// }

//print the table of a number input by the user.
// #include<stdio.h>
// int main(){
//     int num;
//     printf("Enter the number which you want the table : ");
//     scanf("%d", &num);
//     for(int i = 1; i <= 10; i++){
//         printf(" %d * %d = %d\n", num , i, num * i );
//     }
//     return 0;
// }

//class (nested loop)
// #include<stdio.h>
// int main(){
//     int i,j;
//     for(i = 1; i <=5; i++){   //outer loop(row)   5 rows
//         for(j = 1;j <=3; j++){  //inner loop(columns)   3 columns
//             printf("*");
//         }
//         printf("#\n");   //the line is not the inner loop, so it runs once per line, not multiple times.
//     }
//     return 0;
// }

//nested loop some important questions ^^ 
// #include<stdio.h>
// int main(){
//     int i, j;
// for(i = 1; i <= 3; i++) {
//     for(j = 1; j <= 2; j++) {
//         printf("*");
//     }
//     printf("#");
// }
//     return 0;
// }

// 2.for(i = 1; i <= 4; i++) {
//     for(j = 1; j <= i; j++) {
//         printf("%d", j);
//     }
//     printf("\n");
// }
// 3. for(i = 1; i <= 3; i++) {
//     for(j = 3; j >= i; j--) {
//         printf("*");
//     }
//     printf("\n");
// }
// 4. for(i = 1; i <= 3; i++) {
//     for(j = 1; j <= 3; j++) {
//         if(i == j)
//             printf("#");
//         else
//             printf("*");
//     }
//     printf("\n");
// }
// 5. for(i = 1; i <= 4; i++) {
//     for(j = 1; j <= 4; j++) {
//         printf("%d ", i + j);
//     }
//     printf("\n");
// }

// class lecture
// #include<stdio.h>
// int main(){
//     for(int i =1; i<=5; i++){    //5 row
//         for(int j=1; j<= 5-i; j++){     //4 #
//             printf("#");
//         }
//         for(int j=1; j<=i; j++){    // 1 * 
//             printf("*");
//         }
//         printf("\n");
//     }
//     return 0;
// }

//class
// #include<stdio.h>
// int main(){
//     for( int i = 1; i <= 5; i ++){
//         for ( int j = 1; j <= 5 -i; j++){
//             printf("#");
//         }
//         for(int j = 1; j <=2 * 1 -i; j ++){
//             printf("*");
//         }
//         printf("\n");
//     }
//     return 0;
// }

//chat-gpt pattern type question

// #include<stdio.h>
// int main(){
//     for(int i = 1; i<=4; i++){
//         for(int j = 1; j <=4; j++){
//             printf("*");
//         }
//         printf("\n");
//     }
//     return 0;
// }

// #include<stdio.h>
// int main(){
//     for(int i =1; i <=4 ; i++){
//         for(int j = 1; j <=i; j++){
//             printf("*");
//         }
//         printf("\n");
//     }
//     return 0;
// }

// #include <stdio.h>
// int main(){
//     for(int i = 1; i <=4; i++){
//         for( int j = 4; j >=i; j --){
//             printf("*");
//         }
//         printf("\n");
//     }
//     return 0;
// }

//pyramid = 2*i - 1, space = j = i; j< n; j++
// #include<stdio.h>
// int main(){
//     for(int i = 1; i <=4; i++){
//         for(int j = i; j< 4; j++){
//             printf(" ");
//         }
//         for( int j = 1; j <= 2 * i - 1; j++){
//             printf("*");
//         }
//         printf("\n");
//     }
//     return 0;
// }

// #include<stdio.h>
// int main(){
//     for(int i = 4; i >= 1; i--){
//         for(int j = 4; j > i; j--){
//             printf(" ");

//         }
//         for(int j = 1; j <= 2 *i -1 ; j++){
//             printf("*");
//         }
//         printf("\n");
//     }
//     return 0;
// }

// #include<stdio.h>
// int main(){
//     for(int i = 1; i<=4; i++){
//         for(int j = i; j< 4; j++){
//             printf(" ");
//         }
//         for(int j = 1; j <= i ; j++){
//             printf("*");
//         }
//         printf("\n");
//     }
//     return 0;
// }  
//FACTORIAL
// #include<stdio.h>
// int main(){
//     int num;
//     printf("Enter a number: ");
//     scanf("%d", &num);
//     int fac = 1;
//     if(num < 0){
//         printf("The factorial of a negative number is invalid.\n");
//     }else{
//         for( int i = 1; i <= num; i++){
//             fac =  fac * i; 
           
//         }
//          printf("%d \n", fac);
//     }

//     return 0;
// }

//Table of 7 
// #include<stdio.h>
// int main(){
//     int num;
//     printf("Enter the number: ");
//     scanf("%d",&num);
//     for(int i = 1; i <=10; i++){
//         printf("%d x %d = %d\n", num, i, num * i);
//     }
//     return 0;
// }

