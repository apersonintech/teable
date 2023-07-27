import { FieldType } from '@teable-group/core';
import type { IFilterItem, IDateFilter } from '@teable-group/core';

import { Input } from '@teable-group/ui-lib';
import { useCallback, useMemo } from 'react';
import { useField } from '../../../hooks';

import {
  FilterSingleSelect,
  FilterMultipleSelect,
  FilterInput,
  FilterInputNumber,
  FilterDatePicker,
  FilterCheckbox,
  FilterLinkSelect,
  FileTypeSelect,
} from '../component';
import { EMPTYOPERATORS, MULPTIPLEOPERATORS } from '../constant';

interface IFieldValue {
  filter: IFilterItem;
  onSelect: (value: IFilterItem['value']) => void;
}

function FieldValue(props: IFieldValue) {
  const { filter, onSelect } = props;
  const field = useField(filter.fieldId);

  const emptyComponent = <Input className="w-40 m-1 h-8 placeholder:text-[13px]" disabled />;
  const showEmptyComponent = useMemo(() => {
    const showEmpty = EMPTYOPERATORS.includes(filter.operator);
    showEmpty && onSelect?.(null);
    return showEmpty;
  }, [filter.operator, onSelect]);

  const dynamicComponent = useCallback(() => {
    const InputComponent = (
      <FilterInput
        placeholder="Enter a value"
        value={filter.value as string}
        onChange={onSelect}
        className="w-40"
      />
    );

    switch (field?.type) {
      case FieldType.Number:
        return (
          <FilterInputNumber
            placeholder="Enter a value"
            value={filter.value as number}
            onChange={onSelect}
            className="w-40"
          />
        );
      case FieldType.SingleSelect:
        return MULPTIPLEOPERATORS.includes(filter.operator) ? (
          <FilterMultipleSelect
            field={field}
            value={filter.value as string[]}
            onSelect={(value) => onSelect(value as IFilterItem['value'])}
          />
        ) : (
          <FilterSingleSelect
            field={field}
            value={filter.value as string}
            onSelect={onSelect}
            operator={filter.operator}
          />
        );
      case FieldType.MultipleSelect:
        return (
          <FilterMultipleSelect
            field={field}
            value={filter.value as string[]}
            onSelect={(value) => onSelect(value as IFilterItem['value'])}
          />
        );
      case FieldType.Date:
        return (
          <FilterDatePicker
            field={field}
            value={filter.value as IDateFilter}
            onSelect={onSelect}
            operator={filter.operator}
          />
        );
      case FieldType.SingleLineText:
        return InputComponent;
      case FieldType.Checkbox:
        return <FilterCheckbox value={filter.value as boolean} onChange={onSelect} />;
      case FieldType.Link:
        return (
          <FilterLinkSelect
            field={field}
            onSelect={(value) => onSelect(value as IFilterItem['value'])}
            value={filter.value as string[]}
            operator={filter.operator}
          />
        );
      case FieldType.Attachment:
        return <FileTypeSelect value={filter.value as string} onSelect={onSelect} />;
      default:
        return InputComponent;
    }
  }, [field, filter.operator, filter.value, onSelect]);
  return <>{showEmptyComponent ? emptyComponent : dynamicComponent()}</>;
}

export { FieldValue };