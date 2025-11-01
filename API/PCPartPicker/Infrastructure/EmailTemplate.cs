using PCPartPicker.Models;
using System.Globalization;
using static PCPartPicker.Endpoints.EmailEndpoints;

public static class EmailTemplates
{
    public static (string text, string html) ComposeOrderReceipt(Order order, IEnumerable<ReceiptLine> lines)
    {
        var iso = order.Currency?.ToUpperInvariant() ?? "EUR";
        var culture = iso switch
        {
            "USD" => new CultureInfo("en-US"),
            "EUR" => new CultureInfo("de-DE"), // pick what matches your market
            "HUF" => new CultureInfo("hu-HU"),
            _ => CultureInfo.InvariantCulture
        };

        string Money(decimal v) => string.Format(culture, "{0:C}", v);

        var addr = order.ShippingAddress;
        var addrText =
$@"{addr.RecipientName}
{addr.Line1}{(string.IsNullOrWhiteSpace(addr.Line2) ? "" : "\n" + addr.Line2)}
{addr.PostalCode} {addr.City}
{addr.State}, {addr.Country}
{(string.IsNullOrWhiteSpace(addr.Phone) ? "" : "Phone: " + addr.Phone)}";

        var linesText = string.Join("\n", lines.Select(l => $"- {l.name}  x{l.qty}  @ {Money(l.unit)}  = {Money(l.total)}"));

        var text =
$@"Thank you for your order #{order.OrderId}

Order date: {order.OrderDate:u}
Shipping to:
{addrText}

Items:
{linesText}

Total: {Money(order.TotalPrice)} ({iso})

This email is your receipt.";
        // --- HTML ---
        var rows = string.Join("", lines.Select(l =>
            $"<tr><td>{Html(l.name)}</td><td style='text-align:right'>{l.qty}</td><td style='text-align:right'>{Money(l.unit)}</td><td style='text-align:right'>{Money(l.total)}</td></tr>"
        ));

        var html =
$@"
  <div style='font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.4'>
    <h2>Order confirmed</h2>
    <p>Thanks for your purchase. This email is your receipt.</p>

    <h3>Order #{order.OrderId}</h3>
    <p><strong>Date:</strong> {order.OrderDate:u}</p>

    <h3>Shipping address</h3>
    <p>
      {Html(addr.RecipientName)}<br/>
      {Html(addr.Line1)}{(string.IsNullOrWhiteSpace(addr.Line2) ? "" : "<br/>" + Html(addr.Line2))}<br/>
      {Html(addr.PostalCode)} {Html(addr.City)}<br/>
      {Html(addr.State)}, {Html(addr.Country)}<br/>
      {(string.IsNullOrWhiteSpace(addr.Phone) ? "" : "Phone: " + Html(addr.Phone))}
    </p>

    <h3>Items</h3>
    <table width='100%' cellpadding='6' cellspacing='0' style='border-collapse:collapse;border:1px solid #e5e7eb'>
      <thead>
        <tr style='background:#f9fafb'>
          <th align='left'>Item</th>
          <th align='right'>Qty</th>
          <th align='right'>Unit</th>
          <th align='right'>Total</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
      <tfoot>
        <tr>
          <td colspan='3' style='text-align:right;border-top:1px solid #e5e7eb'><strong>Total</strong></td>
          <td style='text-align:right;border-top:1px solid #e5e7eb'><strong>{Money(order.TotalPrice)} ({iso})</strong></td>
        </tr>
      </tfoot>
    </table>

    <p style='color:#6b7280'>If you have questions, reply to this email.</p>
  </div>";

        return (text, html);
    }

    private static string Html(string? s) =>
        System.Net.WebUtility.HtmlEncode(s ?? "");
}
