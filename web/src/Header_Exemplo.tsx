import React from 'react';

//Interface é como se fosse o parametro de uma function, que é um component, no TypeScript
//TS permite ter um controle
interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return(
        <header>
            <h1>{props.title}</h1>
            <h1>Ecoleta</h1>
        </header>
    );
}

export default Header;