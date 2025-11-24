// #include <stdio.h>

// int main() {
//     int arr[] = {69,10,30,2,16,8,31,22};
//     int n = 8;
//     int i, j, temp, minIndex;

//     for(i = 0; i < n-1; i++){
//         minIndex = i;

//         for(j = i+1; j < n; j++){
//             if(arr[j] < arr[minIndex]){
//                 minIndex = j;
//             }
//         }

//         // swap
//         temp = arr[i];
//         arr[i] = arr[minIndex];
//         arr[minIndex] = temp;

//         // print after each step
//         printf("%dstep: ", i + 1);
//         for(int k = 0; k < n; k++){
//             printf("%d ", arr[k]);
//         }
//         printf("\n");
//     }

//     return 0;
// }

// #include<stdio.h>
// int main(){
//     printf("Enter the korean , english and math score :\n");
//     for(int i = 0; i < 3; i++){
//         int kor, eng, math;

//         printf("%d.", i +1);
//         scanf("%d %d %d", &kor, &eng, &math);

//         printf("Korean\tEnglish\tMath\tTotal\tAvg\n");

//         int total;
//         float avg;
//         total = kor + eng + math;
//         avg = (float)total / 3;

//         printf("%d\t%d\t%d\t%d\t%.2f\n", kor,eng, math, total, avg);


//     }
//     return 0;
// }

// #include<stdio.h>
// int main(){
//     printf("Enter the korean , english and math score :\n");
//     for(int i = 0; i < 3; i++){
//         int kor, eng, math;

//         printf("%d.", i +1);
//         scanf("%d %d %d", &kor, &eng, &math);

//         // int total;
//         // float avg;
//         // total = kor + eng + math;
//         // avg = (float)total / 3;

//         // printf("Korean\tEnglish\tMath\tTotal\tAvg\n");
//         // printf("%d\t%d\t%d\t%d\t%.2f\n", kor,eng, math, total, avg);


//     }
    
    
//     for(int i =0, i<3, i++){
//         int kor, eng, math;
//         int total;
//         float avg;
//         total = kor + eng + math;
//         avg = (float)total/3;

//         printf("Korean\tEnglish\tMath\tTotal\tAvg\n");
//         printf("%d\t%d\t%d\t%d\t%.2f\n",kor,eng,math,total,avg);
//     }
//     return 0;
// }

// #include<stdio.h>
// int main(){
//     int value = 125;
//     int *ptr;
//     ptr = &value;

//     printf("value's value: %d\n", value);
//     printf("value's adress: %p\n", &value);
//     printf("pointer's adress: %p\n", ptr);
//     printf("pointer's value: %d\n", *ptr);
//     printf("value: (%d byte)\n", value);     /// byte ta kivabe ashbe???
//     return 0; 
// }

//class image 1st: selection sorting
// #include <stdio.h>

// int main() {
//     int a[8] = {69, 10, 30, 2, 16, 8, 31, 22};
//     int i, j, temp;

//     // Selection Sort
//     for (i = 0; i < 7; i++) {
//         for (j = i + 1; j < 8; j++) {
//             if (a[i] > a[j]) {
//                 temp = a[i];
//                 a[i] = a[j];
//                 a[j] = temp;
//             }
//         }
//     }

//     // Print sorted array
//     printf("Sorted array:\n");
//     for (i = 0; i < 8; i++) {
//         printf("%d ", a[i]);
//     }

//     return 0;           //otput: 2 8 10 16 22 30 31 69 
// }


//print each step 
//#include <stdio.h>

//int main() {
//     int a[8] = {69, 10, 30, 2, 16, 8, 31, 22};
//     int i, j, temp;
    

//     // Selection Sort
//     for (i = 0; i < 7; i++) {
//         for (j = i + 1; j < 8; j++) {
//             if (a[i] > a[j]) {
//                 temp = a[i];
//                 a[i] = a[j];
//                 a[j] = temp;
//             }
//         }

//         // Print array after each outer loop pass
//         printf("%dstep: ", i + 1);
//          for(int k = 0; k < 8; k++){
//              printf("%d ", a[k]);
//        }
//          printf("\n");
//     }

//     return 0;
// }

//Bouble sorting
// #include <stdio.h>

// int main() {
//     int a[5] = {7,4,5,1,3};
//     int i, j, temp, step = 1;

//     for(i = 0; i < 4; i++) {
//         for(j = 0; j < 4 - i; j++) {
//             if(a[j] > a[j+1]) {
//                 temp = a[j];
//                 a[j] = a[j+1];
//                 a[j+1] = temp;
//             }
//         }

//         // print after each pass
//         printf("%d step: ", step++);
//         for(int k = 0; k < 5; k++) {
//             printf("%d ", a[k]);
//         }
//         printf("\n");
//     }

//     return 0;
// }

#include <stdio.h>

int main(void) {
    int i, j, temp;
    int num[5] = {0};

    printf("Enter 5 numbers: ");
    for (i = 0; i < 5; i++) {
        scanf("%d", &num[i]);
    }

    // Sort descending (Bubble sort)
    for (i = 0; i < 5; i++) {
        for (j = i + 1; j < 5; j++) {
            if (num[i] < num[j]) {
                temp = num[i];
                num[i] = num[j];
                num[j] = temp;
            }
        }
    }

    printf("Descending order: ");
    for (i = 0; i < 5; i++)
        printf("%d ", num[i]);

    return 0;
}
