import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from "react";

interface DropdownInterface {
  currencies: Record<string, string>;
  currency: string;
  setCurrency: (currency: string) => void;
  title: string;
}

interface ItemInterface {
  label: string;
  key: string;
  description: string;
}

const Dropdown: React.FC<DropdownInterface> = (props) => {
  const [formattedCurrencies, setFormattedCurrencies] =
    useState<ItemInterface[]>();

  useEffect(() => {
    const d: ItemInterface[] = Object.entries(props.currencies).map((item) => {
      return {
        label: item[1],
        key: item[0],
        description: item[1],
      };
    });

    setFormattedCurrencies(d);
  }, [props.currencies]);

  return (
    <div className="min-w-full col-span-2">
      {formattedCurrencies && (
        <Autocomplete
          className="w-full"
          defaultItems={formattedCurrencies}
          label={props.title}
          selectedKey={props.currency}
          placeholder="Search currency"
          onSelectionChange={(e) => props.setCurrency(e as string)}
        >
          {(cur) => (
            <AutocompleteItem
              key={cur.key}
              textValue={`${cur.key} - ${cur.label}`}
            >
              <div>
                <span className="hidden sm:inline">{`${cur.key} - ${cur.label}`}</span>
                <span className="inline sm:hidden">{cur.key}</span>
              </div>
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    </div>
  );
};

export default Dropdown;
