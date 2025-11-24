#include<stdio.h>
int factorial (int n);         //function declaration

int factorial (int n){           //function definition, n is the function perameter
    int fac = 1;
    for(int i = 1; i <=n; i ++){
         fac = fac * i;
    return fac;
    }
}
int main(){
    int num, result;
    printf("Enter the number: ");
    scanf("%d", &num);

    result = factorial(num);    //calling the function, num is the argument 

    printf("The factorial of %d is %d\n", num, result)
    return 0;
}
