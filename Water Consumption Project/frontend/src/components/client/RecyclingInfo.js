import React from "react";

import "./RecyclingInfo.css";
import dus from "./dus.png";
import robinet from "./robinet.png";

function RecyclingInfo()
{
    return <div className="recycling-info">
        <h2>Consumul de apă</h2>
        <p>V-ați gândit vreodată la nivelul de apă pe care îl consumați și la metode pentru a reduce risipa de apă?</p>
        <p>Aplicația <b>AquaRevivus</b> își propune să vă ajute pentru a eficientiza resurele de apă în gospodăriile și
            familia dumneavoastră. </p>
        <p>Prin intermediul aplicației, puteți adăuga consumul de apă, <b>separat pe locuințe și surse de apă</b>,
            puteți vizualiza statistici și puteți găsi metode pentru a reduce consumul de apă.</p>
        <p>Scopul nostru este să vă ajutăm, în primul rând, să înțelegeți obiceiurile dumneavoastră in ceea ce privește
            consumul de apă, pentru ca apoi să le îmbunătățiți</p>
        <h2>De ce este important?</h2>
        <p>Apa este o resursă limitată și vitală pentru toate formele de viață.</p>
        <p>Cu siguranță ați auzit că în unele zone resursele de apă reprezintă o problemă majoră, unele populații și
            comunități având la dispoziție cantități reduse de apă (inclusiv potabilă). Această problemă a resurselor
            limitate de apă a fost și este intens dezbătută atât la nivel național cât și la nivel global. În unele
            locuri de pe Pământ, apa potabilă va fi disponibilă doar până în anul 2030. Lucru greu de crezut pentru
            unii!</p>
        <p>În acest sens, aplicația <b>AquaRevivus</b> vă oferă unelte pentru a vă ajuta să monitorizați și să reduceți
            consumul de apă.</p>
        <h2>Sfaturi pentru reducerea consumului de apă</h2>
        <h3>Repararea scurgerilor de apă</h3>
        <p>Deși sună foarte simplu, chiar și o scurgere mică poate duce la pierderi semnificative de apă în timp.
            Asigurați-vă că toate robinetele și conductele sunt în stare bună și nu scurg.</p>
        <h3>Instalarea unui duș cu economie de apă</h3>
        <img src={dus} alt=""/>
        <p>Presiunea mare a multor capete de duș moderne duce la consumuri de apă mai mari și cu 80-90%. Aceasta este o
            metodă simplă pentru a economisi.</p>
        <h3>Merită o mașină de spălat vase?</h3>
        <img src={robinet} alt=""/>
        <p>Cu siguranță, din punct de vedere al economisirii apei! Ba chiar mai mult, anumite studii arată caă, pe lângă
            economia de timp, investiția într-un asemenea electrocasnic poate fi amortizată în aproximativ 5 ani,
            devenind astfel și o economie de bani.</p>
        <h2>Zece obiceiuri simple! Sau cum să preveniți risipa de apă!</h2>
        <ol>
            <li>Oprește robinetele atunci când nu le folosești (precum atunci când te speli pe dinți sau când speli vase)!.</li>
            <li>Folosește separat cele două butoane de la vasul toaletei!</li>
            <li>Utilizează o găleată atunci când cureți mașina! </li>
            <li>Colectează apa de ploaie! Apa colectată din precipitații poate fi folosită la irigații. </li>
            <li>Folosește un recipient cu apă atunci când cureți în casă!</li>
            <li>Scurtează durata dușurilor! </li>
            <li>Repară țevile care au scurgeri de apă!</li>
            <li>Utilizează înțelept mașina de spălat vase și mașina de spălat haine (spre exemplu, utilizați cele mai eficiente programe în ceea ce privește consumul de apa! De asemenea, folosește mașina de spălat haine doar când este la capacitate maximă – plină cu haine)!</li>
            <li>Instalează obiecte sanitare eficiente (spre exemplu vase de toaletă cu clapetă dublă). </li>
            <li>Nu spăla fructele/ legumele sub jetul de apă. Mai bine utilizează un vas în care să le speli pentru ca apoi să poti utiliza apa respectivă pentru a uda plantele!</li>
        </ol>
    </div>;
}

export default RecyclingInfo;