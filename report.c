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