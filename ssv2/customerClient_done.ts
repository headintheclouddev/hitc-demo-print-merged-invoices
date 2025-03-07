/**
 * customerClient_done.ts
 * by Head in the Cloud Development, Inc.
 * gurus@headintheclouddev.com
 *
 * @NScriptType ClientScript
 * @NApiVersion 2.1
 */

import currentRecord = require('N/currentRecord');
import url   = require('N/url');

export function pageInit() { // This entry point is not actually implemented

}

export async function printInvoicesBtn() {
  const rec = await currentRecord.get.promise();
  window.location.href = url.resolveScript({ scriptId: 'customscript_print_invoices_sl_done', deploymentId: 'customdeploy1', params: { customer: rec.id } });
}
