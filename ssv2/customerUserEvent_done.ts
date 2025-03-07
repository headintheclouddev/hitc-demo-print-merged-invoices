/**
 * customerUserEvent_done.ts
 * by Head in the Cloud Development, Inc.
 * gurus@headintheclouddev.com
 *
 * @NScriptName Customer - User Event - Done
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

import {EntryPoints} from "N/types";

export function beforeLoad(context: EntryPoints.UserEvent.beforeLoadContext) {
  if (context.type == context.UserEventType.VIEW) {
    context.form.addButton({ id: 'custpage_print_invoices', label: 'Print Invoices', functionName: 'printInvoicesBtn' });
    context.form.clientScriptModulePath = './customerClient_done.js';
  }
}
