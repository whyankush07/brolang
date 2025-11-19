
export interface CodeSnippet {
    title: string;
    description?: string;
    code: string;
    language: string;
}

export const EnglishDocuments: CodeSnippet[] = [
    {
        title: "Declare variables",
        description: "Declare varibales and print the output",
        code: `listen_bro x = 5;
  
listen_bro naam = "Ankush";
  
listen_bro jhanda = bro_true;
listen_bro jhanda2 = bro_false;
  
tell_bro(x)
tell_bro(naam)
tell_bro(jhanda)
tell_bro(jhanda2)`,
        language: "javascript"
    },
    {
        title: "Arithmetic Operations",
        description: "Perform basic arithmetic operations",
        code: `listen_bro x = 4;
x = x / 2;
tell_bro(x);
  
x = 10;
x = x * 2;
tell_bro(x);
  
x = x % 2;
tell_bro(x);
  `,
        language: "javascript"
    },
    {
        title: "Conditional Statements",
        description: "Use conditional statements",
        code: `listen_bro x = 10;
  
bro_if(x % 2 == 1) {
  tell_bro("Even");
} bro_else_if(x == 10) {
  tell_bro("Number is 10");
} bro_else {
  tell_bro("Odd");
}`,
        language: "javascript"
    },
    {
        title: "While Loop",
        description: "Use while loop with 'jaha_tak' keyword",
        code: `listen_bro i = 1;
  
bro_while(i < 10){
  tell_bro(i * 2);
  i = i + 1;
}`,
        language: "javascript"
    },
    {
        title: "For Loop",
        description: "Use for loop with 'chal_bhai' keyword",
        code: `bro_for(listen_bro i = 0; i < 10; i = i + 1) {
  tell_bro(i);
}
  
bro_for(listen_bro i = 10; i > 0; i = i - 1) {
  tell_bro(i);
}`,
        language: "javascript"
    },
    {
        title: "Nested Loops",
        description: "You can try nested while and for loops",
        "code": `listen_bro x = 10;
  
bro_for (listen_bro i = 0; i < x; i = i + 1) {
  bro_for (listen_bro j = 0; j < x; j = j + 1) {
    tell_bro(i);
    tell_bro(j);
  }
}
  `,
        language: "javascript"
    },
    {
        title: "Break and Continue",
        description: "Use break and continue statements",
        code: `bro_for(listen_bro i = 0; i < 10; i = i + 1) {
  bro_if(i == 5) {
    bro_continue;
  } bro_else_if(i == 7) {
    bro_break;
  }
  tell_bro(i);
}`,
        language: "javascript"
    },
    {
        title: "Arrays",
        description: "Implement 1d, 2d and upto n-d arrays",
        code: `listen_bro arr = [1, 2, 3, 4, 5];
listen_bro arr2 = [[1, 2], [3, 4], [5, 6]];
      
tell_bro(arr);
tell_bro(arr[1]);
        
bro_for(tell_bro i = 0; i < 5; i = i + 1) {
  tell_bro(arr[i]);
  tell_bro(arr2[i]);
}`,
        language: "javascript"
    },
];