// #include <stdio.h>
// int main(){
//     char c = 'a';
//     int i =3;
//     double d = 3.14;

//     char *cp = &c;
//     int *ip = &i;
//     double *dp = &d;

//     printf("%d %d %d\n", cp,ip,dp);
//     cp++, ip++, dp++;
//     printf("%d %d %d\n", cp, ip,dp);
//     return 0;
// }

// #include<stdio.h>
// int main(){
//     int *p;
//     int i =3, j;

//     p= &i;
//     j = *p;
//     j++;

//     printf("%d\n", *p);  //3
//     printf("%p\n", p);   
//     printf("%d\n\n", j);   //4

//     p = &j;

//     printf("%d\n", *p);   //4
//     printf("%p\n\n", p);

//     *p = *p + 3;   //7

//     printf("%d\n", i);     //3
//     printf("%d\n", j);     //7
//     printf("%d\n\n", *p);  //7

//     return 0;
// }

// #include<stdio.h>
// int main(){

//     int arr[]={1,3,5};
//     int *p = arr;

//     printf("%d\n", *p);
//     printf("%d\n", *(p++));
//     printf("%d\n", *p++);
//     printf("%d\n", ++*p);
//     printf("%d\n", *p);

//     return 0;

// }

#include<stdio.h>
int main(){
    int a[5] = {10,20,30,40,50};
   int p = a;
    
    printf("%d", sizeof(p));
    printf("%d", sizeof(a));
    p++;
    a++;



    printf("%d", *p);
    printf("%d", *a+1);
    printf("%d",*(a+1));
    return 0;
}
