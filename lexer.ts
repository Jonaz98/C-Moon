//C-Moon Floppy Lexer V.1.0.0F

export enum TokenType {
    Number,
    Indentifier,
    Equals,
    Open, 
    Close,
    BinaryOperator,

    Let,
}

const KEYWORDS: Record<string, TokenType> = {
    "Let": TokenType.Let,
}

export interface Token {
 value: string,
 type: TokenType,
}

function token (value = "", type: TokenType): Token {
   return { value, type };
}

function isalpha (src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isskippable (str: string) {
    return str == ' ' || str == '\n' || str == '\t';
}

function isint (str: string) {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}


export function tokenize (sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");
    
    //build each token until end of file
    while (src.length > 0) {
     if (src[0] == '>') {
       tokens.push(token(src.shift(), TokenType.Open));
    } else if (src[0] == "<") {
       tokens.push(token(src.shift(), TokenType.Close));
    } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/") {
       tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "=") {
        tokens.push(token(src.shift(), TokenType.Equals));
    } else {
        // Handle multicharacter tokens
       
       //Building number handling tokens
       if (isint(src[0])) {
        let num = "";
        while (src.length > 0 && isint(src[0])) {
            num += src.shift();
        }

        tokens.push(token(num, TokenType.Number));
      } else if (isalpha(src[0])) {
        let ident = "";
        while (src.length > 0 && isalpha(src[0])) {
            ident += src.shift();
        }
        

        //check for reserved keywords
        const reserved = KEYWORDS[ident];
        if (reserved == undefined) {
        tokens.push(token(ident, TokenType.Indentifier));
        } else {
        tokens.push(token(ident, reserved));
      }
      
      } else if (isskippable(src[0])) {
        src.shift(); // SKIP THE CURRENT CHARACTER
      } else {
        console.log("C-Moon found an unreconized char at: ", src[0]);
        Deno.exit(1);
      }
     
  }

}

    return tokens;
}


const source = await Deno.readTextFile("./lexer.ts")
for (const token of tokenize(source)); {
    console.log(token);
}
