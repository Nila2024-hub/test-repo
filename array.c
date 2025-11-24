// #include <stdio.h>

// #define STUDENT 3     // number of students
// #define SUBJECT 3     // number of subjects (Korean, English, Math)

// int main() {
//     int score[STUDENT][SUBJECT];  // 2D array to store scores
//     int total[STUDENT];           // total marks of each student
//     float avg[STUDENT];           // average marks of each student
//     int rank[STUDENT];            // rank of each student
//     int i, j;

//     // Input scores
//     printf("%d students' scores (Korean, English, Math):\n", STUDENT);
//     for (i = 0; i < STUDENT; i++) {
//         printf("%d. ", i + 1);
//         for (j = 0; j < SUBJECT; j++) {
//             scanf("%d", &score[i][j]);
//         }
//     }

//     // Calculate total and average
//     for (i = 0; i < STUDENT; i++) {
//         total[i] = 0;
//         for (j = 0; j < SUBJECT; j++) {
//             total[i] += score[i][j];
//         }
//         avg[i] = (float)total[i] / SUBJECT;
//     }

//     // Calculate rank
//     for (i = 0; i < STUDENT; i++) {
//         rank[i] = 1;   // start rank from 1
//         for (j = 0; j < STUDENT; j++) {
//             if (total[j] > total[i]) {
//                 rank[i]++;  // if someone has a higher total, increase rank
//             }
//         }
//     }

//     // Output results
//     printf("\nKorean\tEnglish\tMath\tTotal\tAverage\tRank\n");
//     for (i = 0; i < STUDENT; i++) {
//         for (j = 0; j < SUBJECT; j++) {
//             printf("%d\t", score[i][j]);
//         }
//         printf("%d\t%.2f\t%d\n", total[i], avg[i], rank[i]);
//     }

//     return 0;
// }






//report -03

// #include<stdio.h>
// int main(){
//     int i,j, k= 1;
   


//     for (int i =0; i<5;i++){
//         rowsum = 0;
//         for(j =0; j<5; j++){
            
//             printf("%5d", rowsum += ar[i][j]);
//         }
//           printf("\n");
//     }

//     return 0;
// }

//snake type
// #include<stdio.h>
// int main()
// {
//     int n;
//     printf("Enter the size if the matrix: ");
//     scanf("%d", &n);
    
//     int arr[n][n];   //Each box is arr[row][col]
//     int num =1;   //this is the number we will put into the boxes. We start from 1

//     for(int i = 0; i < n; i++){
//         if( i % 2 == 0){   
//             for(int j = 0; j < n; j++){
//                 arr[i][j] = num++;
//             }

//         }
//         else{
//             for( int j = n -1; j >=0; j--){   
//                 arr[i][j] = num++;
//             }
//         }
//     }

//     printf("\nSnake Pattern Matrix:\n");
//     for( int i = 0; i<n; i++){     //The outer for goes row by row again.
//         for(int j = 0; j< n; j++){ //The inner for prints every number in the row.
//             printf("%3d", arr[i][j]); //prints each number with a little space
//         }
//         printf("\n"); //moves to the next line after finishing a row.
//     }
//     return 0;
// }

// normal 2d matrix type 
// #include<stdio.h>
// int main(){
//     int n;
//     printf("Enter the size of the matrix: ");
//     scanf("%d", &n);

//     int arr[n][n];
//     int num = 1;

//     for ( int i = 0; i < n; i++){
//         for(int j = 0; j < n; j++){
//             arr[i][j] = num ++;
//         }
//     }

//     printf("\n Snake Pattern Matrix: \n");
//     for (int i = 0; i < n; i++){
//         for ( int j = 0; j< n ; j ++){
//             printf("%3d", arr[i][j]);
//         }
//         printf("\n");
//     }
//     return 0;
// }

#include <stdio.h>

int main() {
    int arr[6][6];   // 6x6 array (extra row & column for sums)
    int i, j, k = 1;

    // Fill the first 5x5 part with numbers 1~25
    for(i = 0; i < 5; i++) {
        for(j = 0; j < 5; j++) {
            arr[i][j] = k++;
        }
    }

    // 1. Calculate horizontal (row) sums and store them in column 5
    for(i = 0; i < 5; i++) {
        int rowSum = 0;
        for(j = 0; j < 5; j++) {
            rowSum += arr[i][j];
        }
        arr[i][5] = rowSum;  // store in 6th column
    }

    // 2. Calculate vertical (column) sums and store them in row 5
    for(j = 0; j < 5; j++) {
        int colSum = 0;
        for(i = 0; i < 5; i++) {
            colSum += arr[i][j];
        }
        arr[5][j] = colSum;  // store in 6th row
    }

    // 3. Calculate diagonal sum and store in the last cell arr[5][5]
    int diagSum = 0;
    for(i = 0; i < 5; i++) {
        diagSum += arr[i][i];
    }
    arr[5][5] = diagSum;

    // Print the final 6x6 array
    printf("Resulting 6x6 array with sums:\n");
    for(i = 0; i < 6; i++) {
        for(j = 0; j < 6; j++) {
            printf("%4d", arr[i][j]);
        }
        printf("\n");
    }

    return 0;
}

