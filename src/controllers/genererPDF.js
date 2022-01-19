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

const makePDF = ( {title = '',  orientation = 'p',  format = 'a4',  data = [], id = '', option = {}}) => {
    let table = document.getElementById(id)
    let tableFinalHeight = 0
    console.log("Options : ", option)
    // Pdf using "jspdf-html2canvas"
//     let doc = document.getElementById(id)
//     html2PDF(doc, {
//     jsPDF: {
//       format: 'a4',
//     },
//     imageType: 'image/jpeg',
//     output: './pdf/generate.pdf'
//   })

    // using jsPDF & autotable
    const doc = new jsPDF({ orientation: orientation, format: format})

    let img = document.getElementById('navLogo')
    console.log("fonts : ", doc.getFontList())
    // const myFont = "" // load the *.ttf font file as binary string

// add the font to jsPDF
    // doc.addFileToVFS("MyFont.ttf", myFont)
    // doc.addFont("MyFont.ttf", "MyFont", "bold")
    // doc.setFont("MyFont")

    // Entête de la page
    setEntete(doc, img)
    let head = Object.keys(data[0])
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
        html: table,
        margin : { top: 50},
        didDrawPage: (d) => {
            console.log("final height : ", Math.round(Number(d.cursor.y)))
            tableFinalHeight = Math.round(Number(d.cursor.y))
        },
    })

    // if it is Facture
    if(option.totalTTC){

        doc.setFontSize(14)
        doc.setFont("courrier","bold")
        doc.text("Montant Total :  " + numberFormatter.format(option.totalTTC)  , 20, tableFinalHeight + 10)
        doc.text("Montant Payé :  "+ numberFormatter.format(option.montantRegle.toString()), 20, tableFinalHeight + 18)
        doc.text("Montant Restant :  "+ numberFormatter.format(option.restant), 20, tableFinalHeight + 26)
        doc.text("Règlement en "+ option.modeReglement, 20, tableFinalHeight + 34)

        doc.text("Le Gérant principal ", doc.internal.pageSize.width * 0.8 , tableFinalHeight + 48, {align: 'center'})
        doc.text(option.gerant, doc.internal.pageSize.width * 0.8 , tableFinalHeight + 70, {align: 'center'})

    }
    // console.log("last row : ",doc.internal.getNumberOfPages())

    setFooters(doc)
    doc.save(title+".pdf")


}

const formatedNumber = (strNumber) => {
    return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
}

const setEntete = (doc, img='') => {
    // zapfdingbats Courier Helvetica symbol
    doc.addImage(img, "png", 15,10,15,15)
    // console.log('img : ', img)
    doc.setFontSize(30)
    doc.setFont("Times","bold")
    doc.text("ETS N'NA HAWA MS", 50,15, null, null, )
    doc.setFontSize(15)
    doc.setFont("Courier","bold")
    doc.text("Achat et vente de marchandise", 55,20)
    doc.setFontSize(10)
    doc.setFont("symbol","bold, italic")
    doc.text("Contact : 622 22 91 41 ", doc.internal.pageSize.width / 2, 25, {align: 'center'})
    doc.setTextColor('skyblue')
    doc.setFont("Times","italic")
    doc.text("Email : younoussa41@gmail.com", doc.internal.pageSize.width / 2, 30, {align: 'center'})
    doc.line(0, 35, 400, 35)
}

const setFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages()

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.line(0, 282, 300, 282)
    doc.text("Les articles vendus ne sont ni echangés ni retournés !", 10, 287, { align: 'left'})
    doc.text('Page ' + String(i) + ' sur ' + String(pageCount), doc.internal.pageSize.width * 0.9, 287, {
      align: 'center'
    })
  }
}


const genererPDF = () => {
    return { makePDF }
}

export default genererPDF
