"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  calcItemAmount,
  calcQuoteTotals,
  getQuotesByProjectId,
} from "@/data/mockQuotes";
import { formatKRW } from "@/lib/format";
import { ko } from "@/messages";
import type { Quote, QuoteItem } from "@/types/Quote";

const copy = ko.quote;

const PRESET_NAMES = [
  copy.presets.logoPrint,
  copy.presets.apparel,
  copy.presets.material,
  copy.presets.packaging,
  copy.presets.shipping,
  copy.presets.labor,
  copy.presets.specialProcess,
  copy.presets.ownedItemCheck,
] as const;

type QuoteBuilderProps = {
  projectId: string;
  initialQuote: Quote;
};

export function QuoteBuilder({ projectId, initialQuote }: QuoteBuilderProps) {
  const [items, setItems] = useState<QuoteItem[]>(
    initialQuote.items.map((item) => ({ ...item })),
  );
  const [discount, setDiscount] = useState(initialQuote.discount);
  const [shippingFee, setShippingFee] = useState(initialQuote.shippingFee);
  const [extraFee, setExtraFee] = useState(initialQuote.extraFee);
  const [tax, setTax] = useState(initialQuote.tax);
  const [note, setNote] = useState(initialQuote.note);
  const nextItemSeq = useRef(1);

  const totals = useMemo(
    () => calcQuoteTotals({ items, discount, shippingFee, extraFee, tax }),
    [discount, extraFee, items, shippingFee, tax],
  );

  const previousVersion = getQuotesByProjectId(projectId).find(
    (quote) => quote.version === initialQuote.version - 1,
  );

  function updateItem(id: string, patch: Partial<QuoteItem>) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id || !item.editable) return item;
        const next = { ...item, ...patch };
        next.amount = calcItemAmount(next.quantity, next.unitPrice);
        return next;
      }),
    );
  }

  function addItem(name?: string) {
    const id = `qi-new-${nextItemSeq.current}`;
    nextItemSeq.current += 1;
    setItems((prev) => [
      ...prev,
      {
        id,
        name: name || copy.presets.logoPrint,
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        editable: true,
      },
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function moveItem(id: string, direction: -1 | 1) {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [row] = next.splice(index, 1);
      if (!row) return prev;
      next.splice(target, 0, row);
      return next;
    });
  }

  function copyPrevious() {
    if (!previousVersion) return;
    setItems(
      previousVersion.items.map((item) => {
        const id = `${item.id}-copy-${nextItemSeq.current}`;
        nextItemSeq.current += 1;
        return { ...item, id };
      }),
    );
    setDiscount(previousVersion.discount);
    setShippingFee(previousVersion.shippingFee);
    setExtraFee(previousVersion.extraFee);
    setTax(previousVersion.tax);
    setNote(previousVersion.note);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-start">
      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">
            {copy.itemsTitle}
          </h2>
          <p className="text-[12px] text-[#64748B]">
            V{initialQuote.version}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {PRESET_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => addItem(name)}
              className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1 text-[11px] font-medium text-[#475569] hover:border-[#0F766E] hover:text-[#0F766E]"
            >
              + {name}
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="block text-[12px] text-[#64748B]">
                  {copy.itemName}
                  <input
                    value={item.name}
                    disabled={!item.editable}
                    onChange={(event) =>
                      updateItem(item.id, { name: event.target.value })
                    }
                    className="mt-1 h-9 w-full rounded-md border border-[#E2E8F0] bg-white px-2 text-[13px] text-[#0F172A] outline-none focus:border-[#0F766E]"
                  />
                </label>
                <label className="block text-[12px] text-[#64748B]">
                  {copy.itemDesc}
                  <input
                    value={item.description}
                    disabled={!item.editable}
                    onChange={(event) =>
                      updateItem(item.id, { description: event.target.value })
                    }
                    className="mt-1 h-9 w-full rounded-md border border-[#E2E8F0] bg-white px-2 text-[13px] text-[#0F172A] outline-none focus:border-[#0F766E]"
                  />
                </label>
                <label className="block text-[12px] text-[#64748B]">
                  {copy.quantity}
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    disabled={!item.editable}
                    onChange={(event) =>
                      updateItem(item.id, {
                        quantity: Math.max(1, Number(event.target.value) || 1),
                      })
                    }
                    className="mt-1 h-9 w-full rounded-md border border-[#E2E8F0] bg-white px-2 text-[13px] tabular-nums outline-none focus:border-[#0F766E]"
                  />
                </label>
                <label className="block text-[12px] text-[#64748B]">
                  {copy.unitPrice}
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={item.unitPrice}
                    disabled={!item.editable}
                    onChange={(event) =>
                      updateItem(item.id, {
                        unitPrice: Math.max(0, Number(event.target.value) || 0),
                      })
                    }
                    className="mt-1 h-9 w-full rounded-md border border-[#E2E8F0] bg-white px-2 text-[13px] tabular-nums outline-none focus:border-[#0F766E]"
                  />
                </label>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-semibold tabular-nums text-[#0F172A]">
                  {copy.amount}: {formatKRW(item.amount)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] font-medium disabled:opacity-40"
                    disabled={index === 0}
                    onClick={() => moveItem(item.id, -1)}
                  >
                    {copy.moveUp}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] font-medium disabled:opacity-40"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(item.id, 1)}
                  >
                    {copy.moveDown}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] font-medium text-[#B45309]"
                    onClick={() => removeItem(item.id)}
                  >
                    {copy.removeItem}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => addItem()}>
            {copy.addItem}
          </Button>
        </div>

        <label className="mt-4 block text-[12px] text-[#64748B]">
          {copy.note}
          <textarea
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={copy.notePlaceholder}
            className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#0F766E]"
          />
        </label>
      </section>

      <aside className="space-y-3 lg:sticky lg:top-[4.75rem]">
        <section className="rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">
            {copy.summaryTitle}
          </h2>
          <dl className="mt-3 space-y-2 text-[13px]">
            <Row label={copy.subtotal} value={formatKRW(totals.subtotal)} />
            <EditableMoney
              label={copy.discount}
              value={discount}
              onChange={setDiscount}
            />
            <EditableMoney
              label={copy.shipping}
              value={shippingFee}
              onChange={setShippingFee}
            />
            <EditableMoney
              label={copy.extra}
              value={extraFee}
              onChange={setExtraFee}
            />
            <EditableMoney label={copy.tax} value={tax} onChange={setTax} />
            <div className="flex items-center justify-between border-t border-[#BAE6FD] pt-2">
              <dt className="text-[14px] font-semibold">{copy.total}</dt>
              <dd className="text-[20px] font-bold tabular-nums text-[#0F172A]">
                {formatKRW(totals.total)}
              </dd>
            </div>
          </dl>
        </section>

        <div className="space-y-2 rounded-xl border border-[#E2E8F0] bg-white p-3">
          <Button type="button" variant="outline" className="w-full" disabled>
            {copy.saveDraft}
          </Button>
          <Button
            href={`/project/${projectId}`}
            variant="primary"
            className="w-full"
          >
            {copy.sendQuote}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={!previousVersion}
            onClick={copyPrevious}
          >
            {copy.copyPrevious}
            {previousVersion ? ` (V${previousVersion.version})` : ""}
          </Button>
          <p className="text-[11px] text-[#94A3B8]">{copy.demoAction}</p>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[#64748B]">{label}</dt>
      <dd className="font-medium tabular-nums text-[#0F172A]">{value}</dd>
    </div>
  );
}

function EditableMoney({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-[#64748B]">{label}</span>
      <input
        type="number"
        min={0}
        step={100}
        value={value}
        onChange={(event) =>
          onChange(Math.max(0, Number(event.target.value) || 0))
        }
        className="h-8 w-28 rounded-md border border-[#E2E8F0] bg-white px-2 text-right text-[13px] tabular-nums outline-none focus:border-[#0F766E]"
      />
    </label>
  );
}
