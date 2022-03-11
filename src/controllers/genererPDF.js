import { ref } from "vue"
import jsPDF from "jspdf"
import html2PDF from 'jspdf-html2canvas'
import autotable from 'jspdf-autotable'
import useReglages from './useReglages'

const numberFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'GNF',

})

const dateFormatter = new Intl.DateTimeFormat('FR-fr', {
    dateStyle: 'long',
    timeStyle: 'short'
})

const makeFacture = async( {title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {
    // await useReglages()

    let table = document.getElementById(id)
    let tableFinalHeight = 0

    // using jsPDF & autotable
    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    // console.log("img data : ", img)


    // Entete du tableau
    // let head = Object.keys(data[0]) ? Object.keys(data[0]) : []
    doc.setTextColor('black')
    doc.setFontSize(14)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 45, { align: "center"})

    doc.setFontSize(10)
    doc.setFont("Times","bolditalic")
    doc.text("Client : " + option.client, 15 , 50, { align: "left"})

    doc.setFontSize(9)
    doc.setFont("Times","bold, italic")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 50, { align: "center"})


    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times"},
        headStyles: { fontSize: 15, halign: 'center', fontStyle: "bold"},
        footStyles: { fillColor: "#777b7e", fontSize: 15, halign: 'center'},
        columnStyles: { 1: { halign: 'center',}, 2: { halign: 'center',}, 3: { halign: 'center',}, 4: { halign: 'center',},},
        bodyStyles: { fontSize: '13', fontStyle: 'bold'},
        html: table,
        startY: 53,
        margin : { top: 20},
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })

     // Entête de la page
    await setEntete(doc, img)
    // console.log("fonts : ", doc.getFontList())


    doc.setFontSize(15)
    doc.setFont("times","bold")
    doc.setTextColor("#0e4c92")
    doc.text("Montant Total :  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 14)
    // doc.setLineWidth(0.5)
    doc.setDrawColor("#88807b")
    doc.line(18, tableFinalHeight + 16, 138, tableFinalHeight + 16)

    doc.setTextColor("#0b6633")
    doc.text("Montant Payé :  "+ numberFormatter.format(option.montantRegle.toString()), 20, tableFinalHeight + 22)
    doc.line(18, tableFinalHeight + 24, 138, tableFinalHeight + 24)
    if(option.restant || option.restant ==0) {
        doc.setTextColor("#ed2939")
        doc.text("Montant Restant :  "+ numberFormatter.format(option.restant), 20, tableFinalHeight + 30)
        doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)
    }else if(option.avance) {
        doc.setTextColor("black")
        doc.text("Montant en Avance :  "+ numberFormatter.format(option.avance), 20, tableFinalHeight + 30)
        doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)
    }

    doc.setTextColor("#222021")
    doc.text("Règlement en "+ option.modeReglement, 20, tableFinalHeight + 38)

    doc.setLineWidth(1)
    doc.setDrawColor("black")
    doc.rect(18, tableFinalHeight + 8 , 120, 32);

     doc.setTextColor("black")
    doc.text("Le Gérant principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 50, {align: 'center'})
    doc.text(option.gerant, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 72, {align: 'center'})


    // console.log("last row : ",doc.internal.getNumberOfPages())

    setFooters(doc)
    doc.save(title+".pdf")


}

const makeCommande =async ( {title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {
    let table = document.getElementById(id)
    let tableFinalHeight = 0

    // using jsPDF & autotable
    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())



    doc.setTextColor('black')
    doc.setFontSize(14)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 45, { align: "center"})

    doc.setFontSize(10)
    doc.setFont("Times","bolditalic")
    doc.text("Fournisseur : " + option.fournisseur, 15 , 50, { align: "left"})

    doc.setFontSize(9)
    doc.setFont("Times","bold")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 50, { align: "center"})


    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "Times"},
        headStyles: { fontSize: 15, halign: 'center', fontStyle: "bold"},
        footStyles: { fillColor: "#777b7e"},
        bodyStyles: { fontSize: 14 },
        html: table,
        startY: 53,
        margin : { top: 20},
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })

     // Entête de la page
    // console.log("entete begin")
     await setEntete(doc, img)
    // console.log("entete end")

    doc.setFontSize(16)
    doc.setFont("times","bold")
    doc.setTextColor("#0e4c92")
    doc.text("Montant Total :  " + numberFormatter.format(option.totalHT)  , 20, tableFinalHeight + 14)
    // doc.setLineWidth(0.5)
    doc.setDrawColor("#88807b")
    doc.line(18, tableFinalHeight + 16, 138, tableFinalHeight + 16)

    doc.setTextColor("#0b6633")
    doc.text("Montant Payé :  "+ numberFormatter.format(option.montantRegle.toString()), 20, tableFinalHeight + 22)
    doc.line(18, tableFinalHeight + 24, 138, tableFinalHeight + 24)

    // doc.setTextColor("#ed2939")
    // doc.text("Montant Restant :  "+ numberFormatter.format(option.restant), 20, tableFinalHeight + 30)
    // doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)
     if(option.restant || option.restant ==0) {
        doc.setTextColor("#ed2939")
        doc.text("Montant Restant :  "+ numberFormatter.format(option.restant), 20, tableFinalHeight + 30)
        doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)
    }else if(option.avance) {
        doc.setTextColor("black")
        doc.text("Montant en Avance :  "+ numberFormatter.format(option.avance), 20, tableFinalHeight + 30)
        doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)
    }

    doc.setTextColor("#222021")
    doc.text("Règlement en "+ option.modeReglement, 20, tableFinalHeight + 38)

    // doc.setTextColor("black")
    // doc.text("Règlement en "+ option.modeReglement, 20, tableFinalHeight + 38)

    doc.setLineWidth(1)
    doc.setDrawColor("black")
    doc.rect(18, tableFinalHeight + 8 , 120, 32);
    doc.setTextColor("black")
    doc.setFont("Times","bold")
    doc.text("Acheteur principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 50, {align: 'center'})
    doc.text(option.acheteur, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 72, {align: 'center'})

    // console.log("last row : ",doc.internal.getNumberOfPages())

    setSpecFooters(doc)
    doc.save(title+".pdf")


}
const makeBulletin =async ( {title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {
    let table = document.getElementById(id)
    let tableFinalHeight = 0

    // using jsPDF & autotable
    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())


    doc.setTextColor('black')
    doc.setFontSize(15)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 45, { align: "center"})
    doc.text(option.mois, doc.internal.pageSize.width / 2, 50, { align: "center"})

    doc.setFontSize(10)
    doc.setFont("courier","bold")
    doc.text("Identifiant : " + option.personnelId, 15 , 58, { align: "left"})
    doc.text("Nom : " + option.nom, 15 , 63, { align: "left"})
    doc.text("Fonction : " + option.fonction, 15 , 68, { align: "left"})
    doc.text("Contact : " + option.contact, 15 , 73, { align: "left"})

    doc.setFontSize(9)
    doc.setFont("Times","bold, italic")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 78, { align: "center"})


    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times"},
        headStyles: { fontSize: 15, halign: 'center', fontStyle: "bold"},
        footStyles: { fillColor: "#777b7e", textColor: "#222021", lineColor: 10, lineWidth: 0.5, fontSize: 14, fontStyle: 'bold'},
        bodyStyles: { fontSize: '14'},
        html: table,
        startY: 81,
        margin : { top: 20},
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })
    // Entête de la page
    await setEntete(doc, img)

    doc.setFontSize(15)
    doc.setFont("courier","bold")
    // doc.setTextColor("#0e4c92")
    // doc.text("Montant Total :  " + numberFormatter.format(option.totalHT)  , 20, tableFinalHeight + 14)
    // // doc.setLineWidth(0.5)
    // doc.setDrawColor("#88807b")
    // doc.line(18, tableFinalHeight + 16, 138, tableFinalHeight + 16)

    // doc.setTextColor("#0b6633")
    // doc.text("Montant Payé :  "+ numberFormatter.format(option.montantRegle.toString()), 20, tableFinalHeight + 22)
    // doc.line(18, tableFinalHeight + 24, 138, tableFinalHeight + 24)

    // doc.setTextColor("#ed2939")
    // doc.text("Montant Restant :  "+ numberFormatter.format(option.restant), 20, tableFinalHeight + 30)
    // doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)

    // doc.setTextColor("black")
    // doc.text("Règlement en "+ option.modeReglement, 20, tableFinalHeight + 38)

    // doc.setLineWidth(1)
    // doc.setDrawColor("black")
    // doc.rect(18, tableFinalHeight + 8 , 120, 32);

    doc.text("Le Gestionnaire Principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 30, {align: 'center'})
    doc.text(option.gerant, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 52, {align: 'center'})


    // console.log("last row : ",doc.internal.getNumberOfPages())

    setSpecFooters(doc)
    doc.save(title+".pdf")


}
const makeRapport = async( {title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {
    let table = document.getElementById(id)
    let tableFinalHeight = 0

    // using jsPDF & autotable
    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    // console.log("fonts : ", doc.getFontList())


    doc.setTextColor('black')
    doc.setFontSize(17)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 45, { align: "center"})
    // doc.text(option.mois, doc.internal.pageSize.width / 2, 47, { align: "center"})
    doc.setFontSize(15)
    doc.text("Du :  " + option.dateDe + "      au :  " + option.dateA, doc.internal.pageSize.width / 2, 55, { align: "center"})

    doc.setFontSize(9)
    doc.setFont("Times","bolditalic")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 73, { align: "center"})

    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times"},
        headStyles: { fontSize: 15, halign: 'center', fontStyle: "bold"},
        footStyles: { fillColor: "#b9bbb6", textColor: "#222021", lineColor: 10, lineWidth: 0.5, fontSize: 14, fontStyle: 'bold', },
        bodyStyles: { fontSize: '14'},
        html: table,
        startY: 76,
        margin : { top: 20},
        didParseCell:  (data) => {
            var rows = data.table.foot;
            if ( data.cell.text.toString().includes("Totaux")) {

                rows[data.row.index].cells[4].styles.textColor = "#0b6633";
            }
        },
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })
     // Entête de la page
    await setEntete(doc, img)

    doc.setFontSize(15)
    doc.setFont("courier","bold")
    // doc.setTextColor("#0e4c92")
    // doc.text("Montant Total :  " + numberFormatter.format(option.totalHT)  , 20, tableFinalHeight + 14)
    // // doc.setLineWidth(0.5)
    // doc.setDrawColor("#88807b")
    // doc.line(18, tableFinalHeight + 16, 138, tableFinalHeight + 16)

    // doc.setTextColor("#0b6633")
    // doc.text("Montant Payé :  "+ numberFormatter.format(option.montantRegle.toString()), 20, tableFinalHeight + 22)
    // doc.line(18, tableFinalHeight + 24, 138, tableFinalHeight + 24)

    // doc.setTextColor("#ed2939")
    // doc.text("Montant Restant :  "+ numberFormatter.format(option.restant), 20, tableFinalHeight + 30)
    // doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)

    // doc.setTextColor("black")
    // doc.text("Règlement en "+ option.modeReglement, 20, tableFinalHeight + 38)

    // doc.setLineWidth(1)
    // doc.setDrawColor("black")
    // doc.rect(18, tableFinalHeight + 8 , 120, 32);

    // doc.text("Le Gestionnaire Principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 30, {align: 'center'})
    // doc.text(option.gerant, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 52, {align: 'center'})


    // console.log("last row : ",doc.internal.getNumberOfPages())

    setSpecFooters(doc)
    doc.save(title+".pdf")


}

const makeDocument = async({title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {

    let table = document.getElementById(id)
    let tableFinalHeight = 0

    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())



    // Entete du tableau
    // let head = Object.keys(data[0]) ? Object.keys(data[0]) : []
    doc.setTextColor('black')
    doc.setFontSize(14)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 45, { align: "center"})
    if(option.dateDe) {
        doc.setFontSize(10)
        doc.setFont("Times","bold")
        doc.text("Du : " + option.dateDe, 15 , 50, { align: "left"})
        doc.text("Au : " + option.dateA, 40 , 50, { align: "left"})
    }
    if(option.facture && option.dateDe) {
        doc.text("Fact : " + option.facture, 89, 50, { align: "center"})

    }else if (option.facture && !option.dateDe ) {
        doc.setFontSize(10)
        doc.setFont("Times","bold")
        doc.text("Fact : " + option.facture, 15 , 50, { align: "left"})

    }

    doc.setFontSize(9)
    doc.setFont("Times","bold")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 50, { align: "center"})

    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times", fontSize: 12},
        headStyles: { fontSize: 15, halign: 'center', fontStyle: "bold"},
        footStyles: { fillColor: "#777b7e"},
        bodyStyles: {fontSize: 14},
        html: table,
        startY: 53,
        margin : { top: 20},
        showFoot: "lastPage",
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })
     // Entête de la page
    await setEntete(doc, img)

    if(option.totalTTC && option.totalQte && option.totalPAU ) {
        doc.setFontSize(14)
        doc.setFont("courier","bold")
        doc.setTextColor("black")//doc.setTextColor("#0e4c92")
        doc.text("Montant Total :  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 14)
        // doc.setLineWidth(0.5)
        doc.setDrawColor("#88807b")
        doc.line(18, tableFinalHeight + 16, 138, tableFinalHeight + 16)

        doc.setTextColor("black")//doc.setTextColor("#0b6633")
        doc.text("Total des Quantités :  "+ option.totalQte.toString(), 20, tableFinalHeight + 22)
        doc.line(18, tableFinalHeight + 24, 138, tableFinalHeight + 24)

        doc.setTextColor("black")//doc.setTextColor("#ed2939")
        doc.text("Total PAU :  "+ numberFormatter.format(option.totalPAU), 20, tableFinalHeight + 30)
        // doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)

        doc.setLineWidth(1)
        doc.setDrawColor("black")
        doc.rect(18, tableFinalHeight + 8 , 120, 25);

        if(option.acheteur){
            doc.text("Acheteur principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 50, {align: 'center'})
            doc.text(option.acheteur, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 72, {align: 'center'})
        }
    }else if(title.includes('IMPAYEES')){
        doc.setFontSize(15)
        doc.setFont("courier","bold")
        doc.setTextColor("#ed2939")
        option.totalTTC && doc.text("Montant Total à payer:  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 14)
        // doc.setDrawColor("#ed2939")
        // doc.line(20, tableFinalHeight + 15, Math.round(doc.getTextWidth("Montant Total :  " + numberFormatter.format(option.totalTTC))), tableFinalHeight + 15, 'FD')
        // console.log("text width : ", Math.round(doc.getTextWidth("Montant Total :  " + numberFormatter.format(option.totalTTC))))

    }else if (option.gerant) {
         doc.setFontSize(14)
        doc.setFont("courier","bold")
        doc.setTextColor("#black")
        doc.text("Gérant principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 8, {align: 'center'})
        doc.text(option.gerant, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 27, {align: 'center'})
    }else {
        doc.setFontSize(14)
        doc.setFont("courier","bold")
        doc.setTextColor("#0e4c92")
        option.totalTTC && doc.text("Montant Total :  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 14)
    }


    setFooters(doc)
    doc.save(title+".pdf")


}
const makeLivraison = async({title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {

    let table = document.getElementById(id)
    let tableFinalHeight = 0

    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())



    // Entete du tableau
    // let head = Object.keys(data[0]) ? Object.keys(data[0]) : []
    doc.setTextColor('black')
    doc.setFontSize(14)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 45, { align: "center"})

    doc.setFontSize(12)
    doc.setFont("Times","bold")
    doc.text("Au Nom de  : " + option.client.toUpperCase(), 15, 52, { align: "left"})



    doc.setFontSize(9)
    doc.setFont("Times","bold")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 52, { align: "center"})

    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times", fontSize: 12},
        footStyles: { fillColor: "#777b7e"},
        html: table,
        startY: 56,
        margin : { top: 20},
        showFoot: "lastPage",
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })

     // Entête de la page
    await setEntete(doc, img)

    doc.setFontSize(14)
    doc.setFont("courier","bold")
    doc.setTextColor("#black")//doc.setTextColor("#0e4c92")

    doc.text("Le Gérant principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 14, {align: 'center'})
    doc.text(option.gerant, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 36, {align: 'center'})

    setFooters(doc)
    doc.save(title+".pdf")


}

const formatedNumber = (strNumber) => {
    return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
}

const setEntete = async (doc, img='') => {
    // zapfdingbats Courier Helvetica symbol
    const { getTitre, imgUrl , numeros , titre, adresse, email} = await useReglages()
    // console.log("titre : ", titre)
    // console.log("num  : ", numeros)
    // return

    doc.addImage(img, "png", 8,3,30,30)
    // console.log('img : ', img)
    doc.setFontSize(30)
    doc.setFont("Times","bold")
    doc.text(titre.toUpperCase(), doc.internal.pageSize.width / 2,15, {align: 'center'} )
    // console.log("tite : entt ", titre)
    doc.setFontSize(15)
    doc.setFont("Courier","bold")
    doc.text("Achat et vente de marchandise", doc.internal.pageSize.width / 2,20, {align: 'center'})
    // console.log("achat text")
    doc.setFont("times","bold")
    doc.text(adresse, doc.internal.pageSize.width / 2, 26, {align: 'center'})
    // console.log("sis à didi text")
    doc.setFontSize(14)
    doc.setFont("helvetica","bold")
    doc.text(numeros, doc.internal.pageSize.width / 2, 32, {align: 'center'})
    doc.setFontSize(13)
    doc.setTextColor('#1134A6')
    doc.setFont("Times","bolditalic")
    doc.text("Email : " + email, doc.internal.pageSize.width / 2, 37, {align: 'center'})
    doc.line(0, 40, 400, 40)
}

const setFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages()

  doc.setFont('helvetica', 'bold')
  doc.setTextColor("black")
  doc.setFontSize(9)
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setLineWidth(0.5)
    doc.setDrawColor("#88807b")
    doc.line(0, doc.internal.pageSize.height * 0.92, 300, doc.internal.pageSize.height * 0.92)
    doc.text("Les articles vendus ne sont ni echangés ni retournés !", 10,  doc.internal.pageSize.height * 0.94, { align: 'left'})
    doc.text('Page ' + String(i) + ' sur ' + String(pageCount), doc.internal.pageSize.width * 0.9, doc.internal.pageSize.height * 0.94, {
      align: 'center'
    })
  }
}

const setSpecFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages()

  doc.setFont('helvetica', 'oblique')
  doc.setTextColor("black")
  doc.setFontSize(9)
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setLineWidth(0.5)
    doc.setDrawColor("#88807b")
    doc.line(0, doc.internal.pageSize.height * 0.92, 300, doc.internal.pageSize.height * 0.92)
    doc.text("Ets N'NAHAWA Multi-Services Rep de Guinée - Region : KANKAN- Pref.: Siguiri - Contact :  622 22 91 41 / 621 79 02 82", 5, doc.internal.pageSize.height * 0.94, { align: 'left'})
    doc.text('Page ' + String(i) + ' sur ' + String(pageCount), doc.internal.pageSize.width * 0.9, doc.internal.pageSize.height * 0.94, {
      align: 'center'
    })
  }
}


const genererPDF = () => {
    return { makeFacture, makeDocument, makeCommande, makeLivraison, makeBulletin, makeRapport }
}

export default genererPDF
