//pozor, při nějakém nastavení mi to v kalendáři u posledního úroku a úmoru v procentech psalo NaN

$(document).ready(function(){

    

    function pstStop() { //když je v zadání chyba
        $('#pstVysledek').slideUp();
        $('#pstWarning').fadeIn();
    }

    function pstGo() { //když je zadání OK
        $('#pstVysledek').slideDown();
        $('#pstWarning').fadeOut();
    }

    function pstCZ(toto) {
        return parseFloat(toto).toLocaleString('cs-CZ')
    }

    function pstCZK(toto) {
        return parseFloat(toto).toLocaleString('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 })
    }

    function pstPCT(toto) {
        return parseFloat(toto).toLocaleString('cs-CZ', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    function pstCIS(toto,jeden,dva,pet) {
        if(toto==0) {return ""}
        else if(toto==1)
        {return String(toto + " " + jeden)}
        else if(toto<5) {return String(toto + " " + dva)}
        else {return String(toto + " " + pet)}
    }

    function pstDelkaSplaceni(dluh,sazba,splatka,deleno) {
        var x = Math.log((splatka)/(splatka+((-dluh)*(sazba/deleno))))/Math.log((sazba/deleno)+1);
        
        return Math.ceil(x);
    }

    function pstVyskaSplatky(dluh,sazba,delka,deleno) {
        var x = (dluh*(sazba/deleno))/(1-((1+sazba/deleno)**(-delka)))
        return Math.ceil(x); //zaokrouhlí se nahoru
    }

    /*function pstRPSN(dluh,poplatky,splatka,delka) {
        krok = 0.00001
        for(x=0.000001;x<=0.17;x+=krok) {
            soucet = 0 //vynulujeme
            for(i=0;i<=delka;i++) {
                if (i==0) { //první krok
                    soucet = (dluh-poplatky)/(1)
                    
                } else { //ostatní kroky
                    soucet += (-splatka)/((1+x)**(i/12))
                    
                }
            }
            if(soucet>=-5) {krok=0.00001}
            if(soucet>=-1) {krok=0.000001}
            if(soucet>=-0.5) {krok=0.00000001}
            console.log("Pro X = " + x + " je součet: " + soucet)
            if(soucet > 1000) {console.log("výpočet RPSN selhal; součet: " + soucet); $('#pstRPSN').text("-"); return;}
            if(Math.round(soucet*100)==0) {
                //console.log("RPSN JE: " + x);
                x = ((Math.round(x*10000))/10000)
                //console.log("RPSN JE 2: " + x);
            $('#pstRPSN').text(pstPCT(x))
            return;
        }
        }  
        
    }*/

    //při změně šoupátek... s tím si ještě pohrát.
$('#pstNovaSplatka').on('change',function() {
    pstNovaSplatka = parseInt($('#pstNovaSplatka').val());
    $('#pstNovaSplatkaT').text(pstCZK(pstNovaSplatka))

    pstNovaDelka = pstDelkaSplaceni(pstCelyDluh,pstNovaSazba,pstNovaSplatka,12)
    //console.log("nová délka: " + pstNovaDelka)
    //opakuje se
    $('#pstNovaDelka').val(pstNovaDelka);
    var pstRoky = Math.floor(pstNovaDelka/12)
    var pstMesice = pstNovaDelka % 12;
    $('#pstNovaDelkaT').text(pstCIS(pstNovaDelka,"splátka","splátky","splátek") + ' / ' + pstCIS(pstRoky,"rok","roky","let") + " " + pstCIS(pstMesice,"měsíc","měsíce","měsíců"))
    //opakuje se

    
    pstDluhUroky = pstNovaDelka*pstNovaSplatka

    pstUroky = pstDluhUroky-pstCelyDluh
    $('#pstCelkemT').text(pstCZK(pstDluhUroky));
    $('#pstUrokyT').text(pstCZK(pstUroky));
})

$('#pstNovaSazba').on('change',function() {
    pstNovaSazba = $('#pstNovaSazba').val() //původní hodnota se stanovuje pomocí HTML
    $('#pstNovaSazbaT').text(pstPCT(pstNovaSazba))
    //tohle je stejné!
    pstNovaSplatka = pstVyskaSplatky(pstCelyDluh,pstNovaSazba,pstNovaDelka,12)
    $('#pstNovaSplatka').val(pstNovaSplatka);
    $('#pstNovaSplatkaT').text(pstCZK(pstNovaSplatka));
    //tohle je stejné!
    pstDluhUroky = pstNovaDelka*pstNovaSplatka
    pstUroky = pstDluhUroky-pstCelyDluh
    $('#pstCelkemT').text(pstCZK(pstDluhUroky));
    $('#pstUrokyT').text(pstCZK(pstUroky));
    pstKalendaruj()
})

$('#pstNovaDelka').on('change',function() {
    pstNovaDelka = $('#pstNovaDelka').val()
    var pstRoky = Math.floor(pstNovaDelka/12)
    var pstMesice = pstNovaDelka % 12;
    
    $('#pstNovaDelkaT').text(pstCIS(pstNovaDelka,"splátka","splátky","splátek") + ' / ' + pstCIS(pstRoky,"rok","roky","let") + " " + pstCIS(pstMesice,"měsíc","měsíce","měsíců"))
    //tohle je stejné!
    pstNovaSplatka = pstVyskaSplatky(pstCelyDluh,pstNovaSazba,pstNovaDelka,12)
    $('#pstNovaSplatka').val(pstNovaSplatka);
    $('#pstNovaSplatkaT').text(pstCZK(pstNovaSplatka));
    //tohle je stejné!
    pstDluhUroky = pstNovaDelka*pstNovaSplatka
    pstUroky = pstDluhUroky-pstCelyDluh
    $('#pstCelkemT').text(pstCZK(pstDluhUroky));
    $('#pstUrokyT').text(pstCZK(pstUroky));
    pstKalendaruj()
})



$('#pstSazbaPlus').on('click',function() {
    $('#pstNovaSazba').val(String(parseFloat($('#pstNovaSazba').val())+0.0025)).trigger('change')
    pstKalendaruj()
})
$('#pstSazbaMinus').on('click',function() {
    $('#pstNovaSazba').val(String(parseFloat($('#pstNovaSazba').val())-0.0025)).trigger('change')
    pstKalendaruj()
})

$('#pstDelkaPlus').on('click',function() {
    $('#pstNovaDelka').val(String(parseFloat($('#pstNovaDelka').val())+1)).trigger('change')
    pstKalendaruj()
})

$('#pstDelkaMinus').on('click',function() {
    $('#pstNovaDelka').val(String(parseFloat($('#pstNovaDelka').val())-1)).trigger('change')
    pstKalendaruj()
})

    //...konec změny šoupátek

    //přidává nový řádek v prvním menu
$("#pstPridat").click(function(){
    $("#pstPujcky").append("<li><div class='pstRadek'><table class='pstPujckaTab'><tr><td><span>Zbývající dluh: </span></td><td><input type='number' min='0' class='pstDluh' placeholder='Zbývající dluh v Kč' step='any'></td></tr><tr><td><span><br>Splátka: </span></td><td><input type='number' min='0' class='pstSplatka' placeholder='Splátka v Kč' step='any'></td></tr><tr><td><span><br>Peroidicita: </span></td><td><select class='pstPeriodicita'><option value='0.22999'>týdenní</option><option value='1' selected='selected'>měsíční</option><option value='6'>půlroční</option><option value='12'>roční</option></select>&nbsp;&nbsp;<button class='pstSmazat' type='button'>X</button></td></tr></table></div></li>");
});

    //maže půjčky v prvním menu
$('#pstPujcky').on('click', '.pstSmazat', function() {
    $(this).closest('li').remove();
});

    //HLAVNÍ VÝPOČET ---------------------------------------------------------------------------
$('#pstForm').submit(function() {
    
    pstCelyDluh = 0; //součet všech dluhů
    pstDluhUroky = 0; //dluh s úroky
    pstStareSplatky = 0; //součet starých splátek
    pstStaraDelka = []; //pole pro výpočet délky dluhů - vybereme pak tu nejvyšší
    pstUroky = 0; //Úroky celkového dluhu
    pstPoplatky = 0;
        $('.pstRadek').each(function(index) {
        var pstCelyDluhX = parseFloat($(this).find('input').eq(0).val()); //dluh
        
        
        if ($.isNumeric(pstCelyDluhX)) {pstCelyDluh += pstCelyDluhX; pstStaraDelka.push(pstCelyDluhX)} else {$(this).find('input').eq(0).val(0);pstStaraDelka.push(0)}
        
        $(this).find('input').eq(0).val(String(parseFloat(pstCelyDluhX)))
        var pstStareSplatkyX = parseFloat($(this).find('input').eq(1).val());//splatka
        var pstPeriodicita = parseFloat($(this).find(':selected').val()); //periodicita
        $(this).find('input').eq(1).val(String(parseFloat(pstStareSplatkyX)))
        pstStareSplatkyX = Math.ceil(pstStareSplatkyX/pstPeriodicita);
        if ($.isNumeric(pstStareSplatkyX)) {pstStareSplatky += pstStareSplatkyX; pstStaraDelka[index]=pstStaraDelka[index]/pstStareSplatkyX} else {$(this).find('input').eq(1).val(0); pstStaraDelka[index]=0}
        //console.log(index + ": " + "Celý dluh: " + pstCelyDluhX + " Splátka: " + pstStareSplatkyX + " Periodicita: " + pstPeriodicita)
    });


    

    //pokud člověk zadá blbiny
    if (pstCelyDluh <= 0 || pstStareSplatky <= 0 || pstCelyDluh < pstStareSplatky) {
        pstStop();
        console.log(pstCelyDluh + " = Celý dluh; " + pstStareSplatky + " = Staré splátky ")
        return; //ukonči další počítání
    } else {
        pstGo();

    }

    
    pstStaraDelka = Math.max(...pstStaraDelka) //takhle by se mělo najít nejvyšší pole
    pstNovaDelka = pstStaraDelka < 360 ? pstStaraDelka : 360; //POZOR! je to fejkovej limit!
    $('#pstNovaDelka').val(pstNovaDelka);
    $('#pstNovaDelka').trigger("change");

    pstNovaSazba = parseFloat($('#pstNovaSazba').val());
    
    pstNovaSplatka = pstVyskaSplatky(pstCelyDluh,pstNovaSazba,pstNovaDelka,12)
    $('#pstNovaSplatka').val(pstNovaSplatka);
    
    $('#pstNovaSplatkaT').text(pstCZK(pstNovaSplatka));
    
    

    
    
    pstKalendaruj()
    


    
    

});

function pstKalendaruj() {
    //pstRPSN(pstCelyDluh,pstPoplatky,pstNovaSplatka,pstNovaDelka)
    $('#pstKalendar tbody').empty();
    var pstUmorCelkem = 0;
    var pstUrokCelkem = 0;
    $('#pstKalendar tbody').append('<tr><td>0.</td><td class="pstZbytek">' + pstCZK(pstCelyDluh) + '</td><td class="pstSplatka">-</td><td class="pstUrok">-</td><td class="pstUmor">-</td></tr>');
    var pstZbyva = pstCelyDluh
    for(i=1;i<=pstNovaDelka;i++) {
        pstUrok = pstZbyva //načteme "starý"
        pstZbyva = Math.ceil(pstZbyva*(1+pstNovaSazba/12))
        pstUrok = pstZbyva-pstUrok
        

        if (pstZbyva<pstNovaSplatka) {
            pstNovaSplatka = pstZbyva; 
            
            pstZbyva=0;

            
        } else {pstZbyva = pstZbyva - pstNovaSplatka;}
        pstUrokP = (pstUrok/pstNovaSplatka) //tohle až níž, protože se může změnit splátka v posledním kole
        pstUrokCelkem += pstUrok
        pstUmor = pstNovaSplatka-pstUrok
        pstUmorP = (pstUmor/pstNovaSplatka)
        pstUmorCelkem +=pstUmor
        $('#pstKalendar').append('<tr><td>' + i + '.' + '</td><td class="pstZbytek">' + pstCZK(pstZbyva) + '</td><td>' + pstCZK(pstNovaSplatka) + '</td><td class="pstUrok">' + pstCZK(pstUrok) + ' (' + pstPCT(pstUrokP) + ')' + '</td><td class="pstUmor">' + pstCZK(pstUmor) + ' (' + pstPCT(pstUmorP) + ')' + '</td></tr>')

    }
    pstDluhUroky =  pstUrokCelkem+pstUmorCelkem //Z nějakého důvodu nevychází! 
    
    $('#pstJistinaT').text(pstCZK(pstCelyDluh));
    $('#pstCelkemT').text(pstCZK(pstDluhUroky));
    $('#pstUrokyT').text(pstCZK(pstUrokCelkem));   
    

   

    }

})
