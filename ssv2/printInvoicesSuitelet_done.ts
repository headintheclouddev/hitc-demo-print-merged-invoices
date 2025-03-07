/**
 * printInvoicesSuitelet_done.ts
 * by Head in the Cloud Development, Inc.
 * gurus@headintheclouddev.com
 *
 * @NScriptName Print Invoices Suitelet - Done
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

import {EntryPoints} from "N/types";
import log = require('N/log');
import query = require('N/query');
import render = require('N/render');
import runtime = require('N/runtime');
import url = require('N/url');
import xml = require('N/xml');

export function onRequest(context: EntryPoints.Suitelet.onRequestContext) {
  const customerId = context.request.parameters['customer'];
  log.debug(context.request.method, `Looking up invoices for customer ${customerId}.`);
  // Step 1: Find invoices.  Feel free to add additional filters here, such as open invoices only.
  const invoiceResults: { id: number }[] = query.runSuiteQL({
    query: `SELECT id FROM transaction WHERE entity = ${customerId} AND type = 'CustInvc'`
  }).asMappedResults() as any;
  log.debug('GET', `Customer ${customerId} invoices (${invoiceResults.length}): ${JSON.stringify(invoiceResults)}`);
  // Step 2: Print individual invoices
  const pdfIds: number[] = [];
  for (const invoice of invoiceResults) {
    const invoicePDF = render.transaction({ entityId: invoice.id });
    invoicePDF.folder = 11609;
    invoicePDF.isOnline = true; // Important!
    const pdfId = invoicePDF.save(); // Each invoice costs 30 points to create
    log.debug('GET', `Created PDF ${pdfId} for invoice ${invoice.id}, usage remaining: ${runtime.getCurrentScript().getRemainingUsage()}`);
    pdfIds.push(pdfId);
  }
  // Step 3: Generated a merged PDF containing all the individual invoice PDFs
  const domain = url.resolveDomain({ hostType: url.HostType.APPLICATION });
  let xmlString = '<?xml version="1.0" encoding="UTF-8" ?>';
  xmlString    += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
  xmlString    += '<pdfset>';
  const fileResults: { url: string }[] = query.runSuiteQL({ query: `SELECT url FROM file WHERE id IN (${pdfIds.join(',')})` }).asMappedResults() as any;
  for (const result of fileResults) {
    let fileUrl = `https://${domain}` + result.url;
    fileUrl = xml.escape({ xmlText: fileUrl });
    xmlString += `<pdf src="${fileUrl}" />`;
  }
  xmlString += '</pdfset>';
  context.response.renderPdf({ xmlString });
}
