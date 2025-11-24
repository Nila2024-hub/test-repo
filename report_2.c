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