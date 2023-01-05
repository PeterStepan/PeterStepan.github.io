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

$('#pstNovaSazba').on('change',function() {
    pstNovaSazba = $('#pstNovaSazba').val() //původní hodnota se stanovuje pomocí HTML
    $('#pstNovaSazbaT').text(pstPCT(pstNovaSazba))

    pstNovaSplatka = pstVyskaSplatky(pstCelyDluh,pstNovaSazba,pstNovaDelka,12)
    $('#pstNovaSplatka').val(pstNovaSplatka);
    $('#pstNovaSplatkaT').text(pstCZK(pstNovaSplatka));
    $('#pstNovaSplatkaT2').text(pstCZK(pstNovaSplatka));


    pstDluhUroky = pstNovaDelka*pstNovaSplatka
    pstUroky = pstDluhUroky-pstCelyDluh
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
    $('#pstNovaSplatkaT2').text(pstCZK(pstNovaSplatka));
    //tohle je stejné!
    pstDluhUroky = pstNovaDelka*pstNovaSplatka
    pstUroky = pstDluhUroky-pstCelyDluh

    pstKalendaruj()
})



$('#pstSazbaPlus').on('click',function() {
    $('#pstNovaSazba').val(String(parseFloat($('#pstNovaSazba').val())+0.0001)).trigger('change')
    pstKalendaruj()
})
$('#pstSazbaMinus').on('click',function() {
    $('#pstNovaSazba').val(String(parseFloat($('#pstNovaSazba').val())-0.0001)).trigger('change')
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
    pstPocetRadku = $('.pstRadek').length
    $("#pstPujcky").append("<li><div class='pstRadek pstNormalRadek'><table class='pstPujckaTab'><tr></tr><tr><td><span>Zbývající dluh: </span></td><td><input type='number' min='0' class='pstDluh' placeholder='Zbývající dluh v Kč' step='any'></td></tr><tr class='pstKartaOdkryto'><td><span><br>Splátka: </span></td><td><input type='number' min='0' class='pstSplatka' placeholder='Splátka v Kč' step='any'></td></tr><tr class='pstKartaOdkryto'><td><span><br>Peroidicita: </span></td><td><select class='pstPeriodicita'><option value='0.22999'>týdenní</option><option value='1' selected='selected'>měsíční</option><option value='6'>půlroční</option><option value='12'>roční</option></select></td></tr><tr style='display: none;' class='pstKartaSkryto'><td><span> Úroková sazba: </span></td><td><input type='number' min='0' class='pstSazbaKarta' placeholder='sazba v %' value='29' step='any'></td></tr><tr><td><span>Kreditní karta / debet: </span></td><td><input type='checkbox' class='pstKarta'></td></tr><tr style='display: none;' class='pstKartaSkryto'><td><span> Typ: </span></td><td><input type='radio' class='pstRadio'  name='xxx" + pstPocetRadku + "' value='20' checked>Kreditní karta <input type='radio' name='xxx" + pstPocetRadku + "' class='pstRadio' value='12'>Debet</td></tr></table></div></li>");
    $('#pstSmazat').removeClass('pstNeaktivni')
});

    //maže půjčky v prvním menu
/*$('#pstPujcky').on('click', '.pstSmazat', function() {
    $(this).closest('li').remove();
});*/

//maže poslední řádek
$('#pstSmazat').on('click', function() {
    
    if ($('#pstPujcky li').length > 1) {
    $('#pstPujcky li').last().remove()}
    if ($('#pstPujcky li').length == 1) {
        $('#pstSmazat').addClass('pstNeaktivni')
    } 
    
});

//checkbox v půjčkách, mění class, aby se to mohlo počítat jinak

var pstPocetRadku;
$('#pstPujcky').on('click', '.pstKarta', function() { //tohle jinak nefungovalo
    pstSelekt = $(this).closest('div');

if(this.checked) {
    pstSelekt.removeClass('pstNormalRadek').addClass('pstKartaRadek')
    pstSelekt.find('.pstKartaSkryto').show()
    pstSelekt.find('.pstKartaOdkryto').hide()
 

} else {
    pstSelekt.removeClass('pstKartaRadek').addClass('pstNormalRadek')
    pstSelekt.find('.pstKartaSkryto').hide()
    pstSelekt.find('.pstKartaOdkryto').show()

}
});

    //HLAVNÍ VÝPOČET ---------------------------------------------------------------------------
$('#pstForm').submit(function() {
    
    pstCelyDluh = 0; //součet všech dluhů
    pstDluhUroky = 0; //dluh s úroky
    pstStareSplatky = 0; //součet starých splátek
    pstStaraDelka = []; //pole pro výpočet délky dluhů - vybereme pak tu nejvyšší
    pstUroky = 0; //Úroky celkového dluhu
    pstPoplatky = 0;
    
        $('.pstNormalRadek').each(function(index) { //pro normální úvěry
        var pstCelyDluhX = parseFloat($(this).find('input').eq(0).val()); //dluh
        
        if ($.isNumeric(pstCelyDluhX)) {pstCelyDluh += pstCelyDluhX; pstStaraDelka.push(pstCelyDluhX)} else {$(this).find('input').eq(0).val(0);pstStaraDelka.push(0)}
        
        $(this).find('input').eq(0).val(String(parseFloat(pstCelyDluhX)))
        var pstStareSplatkyX = parseFloat($(this).find('input').eq(1).val());//splatka
        var pstPeriodicita = parseFloat($(this).find(':selected').val()); //periodicita
        $(this).find('input').eq(1).val(String(parseFloat(pstStareSplatkyX)))
        pstStareSplatkyX = Math.ceil(pstStareSplatkyX/pstPeriodicita);
        if ($.isNumeric(pstStareSplatkyX)) {pstStareSplatky += pstStareSplatkyX; pstStaraDelka[index]=pstStaraDelka[index]/pstStareSplatkyX} else {$(this).find('input').eq(1).val(0); pstStaraDelka[index]=0}
    });

    $('.pstKartaRadek').each(function(index) { //pro karty a debet
        var pstObdobi = parseInt($(this).find('input:radio.pstRadio:checked').val());
        var pstDluh = parseFloat($(this).find('input').eq(0).val()); //dluh bez sazby u karty
        var pstSazba = (parseFloat($(this).find('input').eq(2).val()))/100; //sazba u karty    
        pstDluhKarta = pstVyskaSplatky(pstDluh,pstSazba,pstObdobi,12)
        pstCelyDluhX = pstDluhKarta*pstObdobi
        if ($.isNumeric(pstCelyDluhX)) {pstCelyDluh += pstCelyDluhX; pstStaraDelka.push(pstCelyDluhX)} else {$(this).find('input').eq(0).val(0);pstStaraDelka.push(0)}
        console.log("Období: " + pstObdobi + " Dluh bez sazeb: " + pstDluh + " Sazba: " + pstSazba + " splátka: " + pstDluhKarta + " Celkem dluh karta: " + pstCelyDluhX)
        
        
        /*var pstCelyDluhX = parseFloat($(this).find('input').eq(0).val()); //dluh
        
        if ($.isNumeric(pstCelyDluhX)) {pstCelyDluh += pstCelyDluhX; pstStaraDelka.push(pstCelyDluhX)} else {$(this).find('input').eq(0).val(0);pstStaraDelka.push(0)}
        
        $(this).find('input').eq(0).val(String(parseFloat(pstCelyDluhX)))
        var pstStareSplatkyX = parseFloat($(this).find('input').eq(1).val());//splatka
        var pstPeriodicita = parseFloat($(this).find(':selected').val()); //periodicita
        $(this).find('input').eq(1).val(String(parseFloat(pstStareSplatkyX)))
        pstStareSplatkyX = Math.ceil(pstStareSplatkyX/pstPeriodicita);
        if ($.isNumeric(pstStareSplatkyX)) {pstStareSplatky += pstStareSplatkyX; pstStaraDelka[index]=pstStaraDelka[index]/pstStareSplatkyX} else {$(this).find('input').eq(1).val(0); pstStaraDelka[index]=0}*/
    });



    

    //pokud člověk zadá blbiny
    

    if (pstCelyDluh <= 0/* || pstStareSplatky <= 0 || pstCelyDluh < pstStareSplatky*/) {
        pstStop();
        console.log(pstCelyDluh + " = Celý dluh; " + pstStareSplatky + " = Staré splátky ")
        return; //ukonči další počítání
    } else {
        pstGo();
    }
    pstGo();

    
    pstStaraDelka = Math.max(...pstStaraDelka) //takhle by se mělo najít nejvyšší pole
    pstNovaDelka = pstStaraDelka < 360 ? pstStaraDelka : 360; //POZOR! je to fejkovej limit!
    $('#pstNovaDelka').val(pstNovaDelka);
    $('#pstNovaDelka').trigger("change");

    pstNovaSazba = parseFloat($('#pstNovaSazba').val());
    
    pstNovaSplatka = pstVyskaSplatky(pstCelyDluh,pstNovaSazba,pstNovaDelka,12)
    $('#pstNovaSplatka').val(pstNovaSplatka);
    
    $('#pstNovaSplatkaT').text(pstCZK(pstNovaSplatka));
    $('#pstNovaSplatkaT2').text(pstCZK(pstNovaSplatka));
    
    pstKalendaruj()
});

//pro checkBox
    

function pstKalendaruj() {
    $('#pstKalendar tbody').empty();
    var pstUmorCelkem = 0;
    var pstUrokCelkem = 0;
    var pstSplatkaKalendar = pstNovaSplatka //aby to nerozhazovalo celej výpočet, vezmeme si splátku pro sebe
    $('#pstKalendar tbody').append('<tr><td>0.</td><td class="pstSplatka">-</td><td class="pstUrok">-</td><td class="pstUmor">-</td><td class="pstZbytek">' + pstCZK(pstCelyDluh) + '</td></tr>');
    var pstZbyva = pstCelyDluh
    for(i=1;i<=pstNovaDelka;i++) {
        pstUrok = pstZbyva //načteme "starý"
        pstZbyva = pstZbyva*(1+pstNovaSazba/12)
        pstUrok = pstZbyva-pstUrok
        

        if (pstZbyva<pstSplatkaKalendar) {//v posledním kole
            pstSplatkaKalendar = pstZbyva;
            
            pstZbyva=0;

            
        } else {pstZbyva = pstZbyva - pstSplatkaKalendar;}
        //kontroluju tady
        pstUrokP = (pstUrok/pstSplatkaKalendar)
        pstUrokCelkem += pstUrok
        pstUmor = pstSplatkaKalendar-pstUrok
        pstUmorP = (pstUmor/pstSplatkaKalendar)
        pstUmorCelkem +=pstUmor
        $('#pstKalendar').append('<tr><td>' + i + '.' + '</td><td>' + pstCZK(pstSplatkaKalendar) + '</td><td class="pstUrok">' + pstCZK(pstUrok) + ' (' + pstPCT(pstUrokP) + ')' + '</td><td class="pstUmor">' + pstCZK(pstUmor) + ' (' + pstPCT(pstUmorP) + ')' + '</td><td class="pstZbytek">' + pstCZK(pstZbyva) + '</td> </tr>')

    }
    pstDluhUroky =  pstUrokCelkem+pstUmorCelkem  
    
    $('#pstJistinaT').text(pstCZK(pstCelyDluh));
    $('#pstCelkemT').text(pstCZK(pstDluhUroky));
    $('#pstUrokyT').text(pstCZK(pstUrokCelkem));   

    

   

    }

})
