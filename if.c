// #include<stdio.h>
// int main(){
//     int mark;
//     printf("Enter your marks :");
//     scanf("%d", &mark);

//     if( mark > 30){
//         printf("PASS");
//     }
//     else{
//         printf("FAIL");
//     }
//     return 0;
// } 

// #include<stdio.h> 
// int main(){
//     int marks;
//     printf("Enter your marks :");
//     scanf("%d", &marks);

//     if(marks < 30){
//         printf("Your garade is C");
//     }
//     else if(marks >=30  && marks <70){
//         printf("Your grade is B");
//     }
//     else if(marks >=70 && marks <90){
//         printf("Your grade is A");
//     }
//     else if(marks >= 90 && marks <=100){
//         printf("Your grade is A+");
//     }
//     else{
//         printf("Invalid marks.");
//     }
//     return 0;
// }  

// #include<stdio.h>
// int main(){
//     int x = 2;

//     if(x =1){
//         printf("x is equal to 1");
//     }
//     else{
//         printf("x is not equal to 1");
//     }
//     return 0;
// } 

// //uper-case & lower-case
// #include<stdio.h>
// int main(){
//     char ch;
//     printf("Enter the character : ");
//     scanf("%c", &ch);

//     if(ch >='A' && ch <= 'Z'){     // ch >= 65  && ch <= 90 same 
//         printf("The character is Uppercase");
//     }
//     else if( ch >= 'a' && ch <= 'z'){
//         printf("The character is lowercase");
//     }
//     else{
//         printf("This is not an English charater");
//     }
//     return 0;
// }


//After entering the Korean/English/Math scores and calculating the average;
//If your average score is 60 or higher and all subject scores are 60 or higher , you will pass
//If the average score is 60 points or higher but one or more subject scores are below 40 points, fail
//If the avrage is less than 60 points, faied below average.
// #include<stdio.h>
// int main(){
//     int kor, math, eng;
//     printf("Enter your Korean scroe :");
//     scanf("%d", &kor);
//     printf("Enter your Math scroe :");
//     scanf("%d", &math);
//     printf("Enter your English scroe :");
//     scanf("%d", &eng);
    
//     float avg = 0;
//     avg = (kor + math + eng) / 3.0;
//     if( avg >=60){
//         if ( kor >=60 && math>=60 && eng >= 60){
//             printf("PASS\n");
//         }
//         else if( kor < 40 || math < 40 || eng < 40){
//             printf("FAIL(one or more subjects below 40)\n");
//         }
//         else{
//             printf("FAIL(some or more subjects below 60)\n");
//         }
//     }
//     else if( avg < 60){
//         printf("Failed below average");
//     }
//     else{
//         printf("Entered Invalid score");
//     }

//     return 0;
// }


// #include <stdio.h>
// int main(){
//     int numbers[5];
//     numbers[0] = 11;
//     numbers[1] = 22;
//     numbers[2] = 33;
//     numbers[3]= 44;
//     numbers[4] = 55;

//     printf("%d\n", numbers[0]);
//     printf("%d\n", numbers[0]);
//     printf("%d\n", numbers[0]);
//     printf("%d\n", numbers[0]);
//     printf("%d\n", numbers[0]);

//     return 0;
// }

//#include <stdio.h>
//int main() {
//    int numbers[5] = {11, 22, 33, 44, 55};           // dlrtn25@naver.com    Q. max()min() by using 함수, function.

//    for(int i = 0; i < 5; i++) {
  //      printf("%d\n", numbers[i]);
    //}
//
  //  return 0;
//}   

//report - 1
#include <stdio.h>

// Function to find maximum         //function diclaration
int findMax(int arr[], int n) {
    int max = arr[0];   // assume first element is max
    for(int i = 1; i < n; i++) {
        if(arr[i] > max) {                  //function definations 
            max = arr[i];
        }
    }
    return max;
}

// Function to find minimum
int findMin(int arr[], int n) {
    int min = arr[0];   // assume first element is min
    for(int i = 1; i < n; i++) {
        if(arr[i] < min) {
            min = arr[i];
        }
    }
    return min;
}

int main() {
    int n;

    // Ask user for number of elements
    printf("Enter number of elements: ");
    scanf("%d", &n);

    int arr[n];

    // Input array elements
    printf("Enter %d numbers: \n", n);
    for(int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

                               // Call functions
    int max = findMax(arr, n);
    int min = findMin(arr, n);

    // Output results
    printf("Maximum value = %d\n", max);
    printf("Minimum value = %d\n", min);

    return 0;
}



//class 
// #include <stdio.h>  //selection
// int main() {
//     int a[8] = {69,10,30,2,16,8,31,22};  
//     int temp;

//     for (int i = 0; i < 7; i++) {
//         for (int j = i + 1; j < 8; j++) {
//             if (a[i] > a[j]) {
//                 temp = a[i];
//                 a[i] = a[j];
//                 a[j] = temp;
//             }
//         }
//     }

//     printf("Sorted array: ");
//     for (int i = 0; i < 8; i++) {
//         printf("%d ", a[i]);
//     }

//     return 0;
// }  

// #include <stdio.h>

// int main() {
//     int arr[5] = {5, 3, 1, 4, 2}; // Example array
//     int n = 5;
//     int temp;

//     // Bubble Sort
//     for (int i = 0; i < n - 1; i++) {         // Outer loop for passes
//         for (int j = 0; j < n - i - 1; j++) { // Inner loop for comparisons
//             if (arr[j] > arr[j + 1]) {        // If elements are in wrong order
//                 temp = arr[j];
//                 arr[j] = arr[j + 1];
//                 arr[j + 1] = temp;            // Swap them
//             }
//         }
//     }

//     // Print sorted array
//     printf("Sorted array: ");
//     for (int i = 0; i < n; i++) {
//         printf("%d ", arr[i]);
//     }
//     return 0;
// }

