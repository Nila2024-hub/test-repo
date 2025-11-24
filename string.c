//what is the difference between %d and %S 
// what is char *string = "Hello"
// char arry[]] = "Array"
// #include<stdio.h> 
// int main(){
//     char str[]="hello";
//     char *sp ="hello";

//     printf("%s\n", str);
//     printf("%s\n",sp);

//     str[2]= 'L';           //string array's value can change
//     printf("%s\n", str);

//     //sp[2] ="L";
//     //printf("%s\n", sp);   // string pointer value can't change
    
//     return 0;
// }

//report -04
// #include <stdio.h>

// int main() {
//     char str[100];    // string array
//     char *ptr;        // string pointer
//     int i;

//     printf("Enter an uppercase word: ");
//     scanf("%s", str);  // input the word

//     ptr = str;  // pointer points to first element of string

//     // using for loop and if condition
//     for (i = 0; ptr[i] != '\0'; i++) {
//         if (ptr[i] >= 'A' && ptr[i] <= 'Z') {
//             ptr[i] = ptr[i] + 32;  // convert to lowercase
//         }
//     }

//     printf("Lowercase word: %s\n", str);

//     return 0;
// }



// #include<stdio.h>
// int main(){
//     int arr[] ={3,1,4,1,5};
//     int *p = arr;
//     int *pp = &p;
//     int i;

//     for(i =0; i < n; i++){
        
//     }
//     return 0;
// }

// #include<stdio.h>

//     void swap(int** a, int** b){
//         int temp = **a;
//         **a = **b;
//         **b = temp;
//     }

//     int main(){
//         int x = 5, y = 10;
//         int* px = &x;
//         int* py = &y;
//         int** px = &px;
//         int** px = &py;

//            printf("Before swap : x = %d, y = %d\n", x,y);
//            swap(ppx,ppy);
//            printf("After swap : x = %d, y = %d\n", x,y);
    
//            return 0;

//     }
 
// #include <stdio.h>
// int main(){
//     int test[]={1,3,5};
//     int* p = test;

//     printf("*p : %3d\n", *p);
//     printf("*(p++) : %3d\n", *(p++));
//     printf("*p++ : %3d\n", *p++);
//     printf("*++p : %3d\n", ++*p);
//     printf("(*p)++ : %3d\n", (*p)++);
//     printf("*p : %3d\n", *p);
    
//     return 0;
// }  

// #include<stdio.h>
// #include<string.h>
// int main(){

//     char str[7] = "banana";
//     printf("str = %s\n",str);
//     char buf[6];
//     strcpy(buf, "apple");
//     printf("buf = %s\n", buf);
       
//     return 0;
// }




 
#include <stdio.h>
#include <string.h>

#define MAX 100
#define NAME_LEN 50

int main(){
    int n,i,j;
    int id[MAX];
    char name[MAX][NAME_LEN];
    int kor[MAX], eng[MAX], math[MAX];
    int total[MAX];
    double avg[MAX];
    int rank_arr[MAX];

    printf("Enter the student number: ");
    scanf("%d", &n);
    if(n < 1 || n > MAX){
        printf("The number of student must be between 1~%d.\n", MAX);
        return 1;
    }

    for(i = 0; i < n; i++){
        printf("\nEntering student #%d\n", i + 1);
        printf("ID: ");
        scanf("%d", &id[i]);
        printf("Name: ");
        scanf("%s", name[i]); // single-word name only
        printf("Korean score: ");
        scanf("%d", &kor[i]);
        printf("English score: ");
        scanf("%d", &eng[i]);
        printf("Math score: ");
        scanf("%d", &math[i]);

        total[i] = kor[i] + eng[i] + math[i];
        avg[i] = total[i] / 3.0;
        rank_arr[i] = 1;
    }

    for (i = 0; i < n; i++){
        for(j = 0; j < n; j++){
            if (total[i] < total[j]){
                rank_arr[i]++;
            }
        }
    }

    printf("\n%-3s %-5s %6s %8s %8s %8s %10s %6s\n",
       "ID", "Name", "Korean", "English", "Math",
       "Total", "Average", "Rank");

    for(i = 0; i < n; i++){
        printf("%d\t%s\t%d\t%d\t%d\t%d\t%.2f\t%d\n",
               id[i], name[i],
               kor[i], eng[i], math[i],
               total[i], avg[i], rank_arr[i]);
    }

    return 0;
}
