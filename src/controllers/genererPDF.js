import { ref } from "vue"
import jsPDF from "jspdf"
import html2PDF from 'jspdf-html2canvas'
import autotable from 'jspdf-autotable'

const numberFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'GNF',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

const dateFormatter = new Intl.DateTimeFormat('FR-fr', {
    dateStyle: 'long',
    timeStyle: 'short'
 })

const makeFacture = ( {title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {
    let table = document.getElementById(id)
    let tableFinalHeight = 0
        // console.log("Options : ", option)
        // Pdf using "jspdf-html2canvas"
    //  let doc = document.getElementById(id)
    //  html2PDF(doc, {
    //  jsPDF: {
    //    format: 'a4',
    //  },
    //  imageType: 'image/jpeg',
    //  output: './pdf/generate.pdf'
    //})

    // using jsPDF & autotable
    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())

    // Entête de la page
    setEntete(doc, img)

    // Entete du tableau
    // let head = Object.keys(data[0]) ? Object.keys(data[0]) : []
    doc.setTextColor('black')
    doc.setFontSize(14)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 42, { align: "center"})

    doc.setFontSize(10)
    doc.setFont("Times","bolditalic")
    doc.text("Client : " + option.client, 15 , 47, { align: "left"})

    doc.setFontSize(9)
    doc.setFont("Times","bold, italic")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 47, { align: "center"})


    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times"},
        headStyles: { fontSize: 15, halign: 'center'},
        footStyles: { fillColor: "#777b7e", fontSize: 15},
        columnStyles: { 1: { halign: 'center',}, 2: { halign: 'center',}, 3: { halign: 'center',}, 4: { halign: 'center',},},
        bodyStyles: { fontSize: '13', fontStyle: 'bold'},
        html: table,
        startY: 50,
        margin : { top: 20},
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })

    doc.setFontSize(14)
    doc.setFont("courrier","bold")
    doc.setTextColor("#0e4c92")
    doc.text("Montant Total :  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 14)
    // doc.setLineWidth(0.5)
    doc.setDrawColor("#88807b")
    doc.line(18, tableFinalHeight + 16, 138, tableFinalHeight + 16)

    doc.setTextColor("#0b6633")
    doc.text("Montant Payé :  "+ numberFormatter.format(option.montantRegle.toString()), 20, tableFinalHeight + 22)
    doc.line(18, tableFinalHeight + 24, 138, tableFinalHeight + 24)

    doc.setTextColor("#ed2939")
    doc.text("Montant Restant :  "+ numberFormatter.format(option.restant), 20, tableFinalHeight + 30)
    doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)

    doc.setTextColor("black")
    doc.text("Règlement en "+ option.modeReglement, 20, tableFinalHeight + 38)

    doc.setLineWidth(1)
    doc.setDrawColor("black")
    doc.rect(18, tableFinalHeight + 8 , 120, 32);

    doc.text("Le Gérant principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 50, {align: 'center'})
    doc.text(option.gerant, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 72, {align: 'center'})


    // console.log("last row : ",doc.internal.getNumberOfPages())

    setFooters(doc)
    doc.save(title+".pdf")


}
const makeCommande = ( {title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {
    let table = document.getElementById(id)
    let tableFinalHeight = 0

    // using jsPDF & autotable
    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())

    // Entête de la page
    setEntete(doc, img)

    doc.setTextColor('black')
    doc.setFontSize(14)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 42, { align: "center"})

    doc.setFontSize(10)
    doc.setFont("Times","bolditalic")
    doc.text("Fournisseur : " + option.fournisseur, 15 , 47, { align: "left"})

    doc.setFontSize(9)
    doc.setFont("Times","bold, italic")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 47, { align: "center"})


    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times"},
        footStyles: { fillColor: "#777b7e"},
        html: table,
        startY: 50,
        margin : { top: 20},
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })

    doc.setFontSize(14)
    doc.setFont("courrier","bold")
    doc.setTextColor("#0e4c92")
    doc.text("Montant Total :  " + numberFormatter.format(option.totalHT)  , 20, tableFinalHeight + 14)
    // doc.setLineWidth(0.5)
    doc.setDrawColor("#88807b")
    doc.line(18, tableFinalHeight + 16, 138, tableFinalHeight + 16)

    doc.setTextColor("#0b6633")
    doc.text("Montant Payé :  "+ numberFormatter.format(option.montantRegle.toString()), 20, tableFinalHeight + 22)
    doc.line(18, tableFinalHeight + 24, 138, tableFinalHeight + 24)

    doc.setTextColor("#ed2939")
    doc.text("Montant Restant :  "+ numberFormatter.format(option.restant), 20, tableFinalHeight + 30)
    doc.line(18, tableFinalHeight + 32, 138, tableFinalHeight + 32)

    doc.setTextColor("black")
    doc.text("Règlement en "+ option.modeReglement, 20, tableFinalHeight + 38)

    doc.setLineWidth(1)
    doc.setDrawColor("black")
    doc.rect(18, tableFinalHeight + 8 , 120, 32);

    doc.text("Acheteur principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 50, {align: 'center'})
    doc.text(option.acheteur, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 72, {align: 'center'})


    // console.log("last row : ",doc.internal.getNumberOfPages())

    setSpecFooters(doc)
    doc.save(title+".pdf")


}
const makeBulletin = ( {title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {
    let table = document.getElementById(id)
    let tableFinalHeight = 0

    // using jsPDF & autotable
    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())

    // Entête de la page
    setEntete(doc, img)

    doc.setTextColor('black')
    doc.setFontSize(15)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 42, { align: "center"})
    doc.text(option.mois, doc.internal.pageSize.width / 2, 47, { align: "center"})

    doc.setFontSize(10)
    doc.setFont("courrier","bold")
    doc.text("Identifiant : " + option.personnelId, 15 , 55, { align: "left"})
    doc.text("Nom : " + option.nom, 15 , 60, { align: "left"})
    doc.text("Fonction : " + option.fonction, 15 , 65, { align: "left"})
    doc.text("Contact : " + option.contact, 15 , 70, { align: "left"})

    doc.setFontSize(9)
    doc.setFont("Times","bold, italic")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 70, { align: "center"})


    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times"},
        headStyles: { fontSize: 14 },
        footStyles: { fillColor: "#777b7e", textColor: "#222021", lineColor: 10, lineWidth: 0.5, fontSize: 14, fontStyle: 'bold'},
        bodyStyles: { fontSize: '13'},
        html: table,
        startY: 73,
        margin : { top: 20},
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })

    doc.setFontSize(15)
    doc.setFont("courrier","bold")
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

const makeDocument = ({title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {

    let table = document.getElementById(id)
    let tableFinalHeight = 0

    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())

    // Entête de la page
    setEntete(doc, img)

    // Entete du tableau
    // let head = Object.keys(data[0]) ? Object.keys(data[0]) : []
    doc.setTextColor('black')
    doc.setFontSize(14)
    doc.setFont("Times","bold")
    doc.text(title, doc.internal.pageSize.width / 2, 42, { align: "center"})
    if(option.dateDe) {
        doc.setFontSize(10)
        doc.setFont("Times","bold")
        doc.text("Du : " + option.dateDe, 15 , 47, { align: "left"})
        doc.text("Au : " + option.dateA, 40 , 47, { align: "left"})
    }
    if(option.facture && option.dateDe) {
        doc.text("Fact : " + option.facture, 89, 47, { align: "center"})

    }else if (option.facture && !option.dateDe ) {
        doc.setFontSize(10)
        doc.setFont("Times","bold")
        doc.text("Fact : " + option.facture, 15 , 47, { align: "left"})

    }

    doc.setFontSize(9)
    doc.setFont("Times","bold, italic")
    doc.text("Siguiri, le " + dateFormatter.format(new Date().now), doc.internal.pageSize.width * 0.8 , 47, { align: "center"})

    // Generation du tableau en fonction du tableau html fournis
    autotable(doc, {
        styles: { font: "times", fontSize: 12},
        footStyles: { fillColor: "#777b7e"},
        html: table,
        startY: 50,
        margin : { top: 20},
        showFoot: "lastPage",
        didDrawPage: (d) => {
            // console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })

    if(option.totalTTC && option.totalQte && option.totalPAU ) {
        doc.setFontSize(14)
        doc.setFont("courrier","bold")
        doc.setTextColor("#black")//doc.setTextColor("#0e4c92")
        doc.text("Montant Total :  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 14)
        // doc.setLineWidth(0.5)
        doc.setDrawColor("#88807b")
        doc.line(18, tableFinalHeight + 16, 138, tableFinalHeight + 16)

        doc.setTextColor("#black")//doc.setTextColor("#0b6633")
        doc.text("Total des Quantités :  "+ option.totalQte.toString(), 20, tableFinalHeight + 22)
        doc.line(18, tableFinalHeight + 24, 138, tableFinalHeight + 24)

        doc.setTextColor("#black")//doc.setTextColor("#ed2939")
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
        doc.setFont("courrier","bold")
        doc.setTextColor("#ed2939")
        option.totalTTC && doc.text("Montant Total :  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 14)
        // doc.setDrawColor("#ed2939")
        // doc.line(20, tableFinalHeight + 15, Math.round(doc.getTextWidth("Montant Total :  " + numberFormatter.format(option.totalTTC))), tableFinalHeight + 15, 'FD')
        // console.log("text width : ", Math.round(doc.getTextWidth("Montant Total :  " + numberFormatter.format(option.totalTTC))))

    }else if (option.gerant) {
         doc.setFontSize(14)
        doc.setFont("courrier","bold")
        doc.text("Gérant principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 30, {align: 'center'})
        doc.text(option.gerant, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 52, {align: 'center'})
    }else {
        doc.setFontSize(14)
        doc.setFont("courrier","bold")
        doc.setTextColor("#0e4c92")
        option.totalTTC && doc.text("Montant Total :  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 14)
    }


    setFooters(doc)
    doc.save(title+".pdf")


}

const formatedNumber = (strNumber) => {
    return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
}

const setEntete = (doc, img='') => {
    // zapfdingbats Courier Helvetica symbol
    doc.addImage(img, "png", 10,3,30,30)
    // console.log('img : ', img)
    doc.setFontSize(30)
    doc.setFont("Times","bold")
    doc.text("ETS N'NA HAWA MS", 50,15, null, null, )
    doc.setFontSize(15)
    doc.setFont("Courier","bold")
    doc.text("Achat et vente de marchandise", 55,20)
    doc.setFontSize(14)
    doc.setFont("symbol","bold")
    doc.text("Contact : 622 22 91 41 / 621 79 02 82 / 663 63 05 66 ", doc.internal.pageSize.width / 2, 25, {align: 'center'})
    doc.setFontSize(14)
    doc.setTextColor('skyblue')
    doc.setFont("Times","italic")
    doc.text("Email : younoussa41@gmail.com", doc.internal.pageSize.width / 2, 30, {align: 'center'})
    doc.line(0, 35, 400, 35)
}

const setFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages()

  doc.setFont('helvetica', 'italic')
  doc.setTextColor("black")
  doc.setFontSize(8)
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setLineWidth(0.5)
    doc.setDrawColor("#88807b")
    doc.line(0, 282, 300, 282)
    doc.text("Les articles vendus ne sont ni echangés ni retournés !", 10, 287, { align: 'left'})
    doc.text('Page ' + String(i) + ' sur ' + String(pageCount), doc.internal.pageSize.width * 0.9, 287, {
      align: 'center'
    })
  }
}
const setSpecFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages()

  doc.setFont('helvetica', 'italic')
  doc.setTextColor("black")
  doc.setFontSize(8)
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setLineWidth(0.5)
    doc.setDrawColor("#88807b")
    doc.line(0, 282, 300, 282)
    doc.text("Ets N'NAHAWA Multi-Services Rep de Guinée - Region : KANKAN- Pref.: Siguiri - Contact :  22 22 91 41 / 621 79 02 82", 5, 287, { align: 'left'})
    doc.text('Page ' + String(i) + ' sur ' + String(pageCount), doc.internal.pageSize.width * 0.9, 287, {
      align: 'center'
    })
  }
}


const genererPDF = () => {
    return { makeFacture, makeDocument, makeCommande, makeBulletin }
}

export default genererPDF
