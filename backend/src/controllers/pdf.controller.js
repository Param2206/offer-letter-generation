import fs, { rmdir } from "fs";
import puppeteer from "puppeteer";

// Function to get the ordinal suffix for the day
const getOrdinalSuffix = (day) => {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const generateOfferLetter = async (req, res, next) => {
  try {
    // Retrieve student data from request body
    const student = req.body;

    // Read the HTML template from a file
    const htmlTemplate = fs.readFileSync(
      "src/template/offerLetterTemplate.html",
      "utf8"
    );

    // Populate the HTML template with student data
    const populatedTemplate = htmlTemplate
      .replaceAll("{studentId}", student.studentId)
      .replaceAll("{studentName}", student.studentName)
      .replaceAll("{countryName}", student.countryName)
      .replaceAll("{qualification}", student.qualification)
      .replaceAll("{courseOfStudy}", student.courseOfStudy)
      .replaceAll("{duration}", student.duration)
      .replaceAll("{totalAnnualTuitionFee}", student.totalAnnualTuitionFee)
      .replaceAll("{hostelMessAndOtherFees}", student.hostelMessAndOtherFees)
      .replaceAll("{totalAnnualFees}", student.totalAnnualFees)
      .replaceAll(
        "{specialScholarshipFromInstitute}",
        student.specialScholarshipFromInstitute
      )
      .replaceAll(
        "{MUPresidentsSpecialScholarship}",
        student.MUPresidentsSpecialScholarship
      )
      .replaceAll("{netAnnualFeePayable}", student.netAnnualFeePayable);

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString("default", { month: "long" });
    const year = currentDate.getFullYear();
    const ordinalSuffix = getOrdinalSuffix(day);
    const formattedDate = `${day}<sup>${ordinalSuffix}</sup> ${month}, ${year}`;
    const academicYear = `${year}-${(year + 1).toString().slice(-2)}`;
    // Replace the placeholder for the date in the template
    const finalTemplate = populatedTemplate
      .replaceAll("DD<sup>su </sup>Month, YYYY", `${formattedDate}`)
      .replaceAll("{academicYear}", academicYear);

    // Generate offer letter PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(finalTemplate);
    await page.evaluate(() => {
      const div = document.createElement("div");
      // img.src = "https://drive.google.com/thumbnail?id=1WYXvgMfu3hL-sMzqFKFHvxP1hl7LEdRg";
      div.innerHTML = `Not Valid for VISA Purpose`;
      div.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        opacity: 0.1;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-family: 'Arial', sans-serif;
        font-size: 55pt;
        color: rgba(136, 136, 136);
        z-index: 10000;
        white-space: nowrap;
      `;
      div.alt = "MU Logo";
      document.body.appendChild(div);
    });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Send the generated PDF as response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${student.studentName}_offer_letter.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

// import fs from 'fs';
// import { PDFDocument } from 'pdf-lib';

// // Function to get the ordinal suffix for the day
// const getOrdinalSuffix = (day) => {
//   if (day >= 11 && day <= 13) {
//     return 'th';
//   }
//   switch (day % 10) {
//     case 1:
//       return 'st';
//     case 2:
//       return 'nd';
//     case 3:
//       return 'rd';
//     default:
//       return 'th';
//   }
// };

// const getFormattedDate = () => {
//   const currentDate = new Date();
//   const day = currentDate.getDate();
//   const month = currentDate.toLocaleString('default', { month: 'long' });
//   const year = currentDate.getFullYear();
//   const ordinalSuffix = getOrdinalSuffix(day);
//   return `${day}${ordinalSuffix} ${month}, ${year}`;
// };

// export const generateOfferLetter = async (req, res, next) => {
//   try {
//     // Retrieve student data from request body
//     const student = req.body;
//     console.log('Student Data:', student);

//     // Read the PDF template from a file
//     const templatePath = 'src/template/sample_with_form.pdf';
//     const templateBytes = await fs.promises.readFile(templatePath);
//     console.log('Template PDF loaded successfully');

//     // Load the template PDF
//     const pdfDoc = await PDFDocument.load(templateBytes);
//     console.log('PDFDocument loaded successfully');

//     const form = pdfDoc.getForm();

//     // Replace placeholders with student data
//     const fields = {
//       Text1: student.studentId,
//       Text2: getFormattedDate(),
//       Text3: student.qualification,
//       Text4: student.courseOfStudy,
//     };

//     Object.keys(fields).forEach(fieldName => {
//       const field = form.getTextField(fieldName);
//       if (field) {
//         field.setText(fields[fieldName]);
//         console.log(`Set field ${fieldName} to ${fields[fieldName]}`);
//       } else {
//         console.warn(`Field ${fieldName} not found in the PDF form`);
//       }
//     });

//     // Flatten the form to make fields non-editable (optional)
//     form.flatten();
//     console.log('Form fields flattened');

//     // Serialize the modified PDF
//     const modifiedPdfBytes = await pdfDoc.save();
//     console.log('PDFDocument saved successfully');

//     // Send the generated PDF as response
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader(
//       'Content-Disposition',
//       `attachment; filename="${student.studentId}_offer_letter.pdf"`
//     );

//     // Convert the Uint8Array to a Buffer before sending
//     res.send(Buffer.from(modifiedPdfBytes));
//     console.log('PDF sent as response');
//   } catch (error) {
//     console.error('Error generating offer letter:', error);
//     next(error);
//   }
// };
