import { Meta, StoryObj } from "@storybook/react";
import { BaseInput } from "./Input";

type Story = StoryObj<typeof BaseInput>;

const meta: Meta<typeof BaseInput> = {
  title: "Components/BaseInput",
  component: BaseInput,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Метка для инпута" },
    id: { control: "text", description: "ID для инпута" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
      description: "Тип инпута",
    },
    name: { control: "text", description: "Имя инпута" },
    placeholder: { control: "text", description: "Placeholder текста" },
    value: { control: "text", description: "Текущее значение инпута" },
    onChange: { action: "changed", description: "Функция изменения значения" },
    required: { control: "boolean", description: "Обязательность поля" },
  },
};

export default meta;

export const Default: Story = {
  args: {
    label: "Введите имя",
    id: "name",
    type: "text",
    name: "name",
    placeholder: "Ваше имя",
    value: "",
    required: false,
  },
};

export const RequiredField: Story = {
  args: {
    label: "Введите имя",
    id: "name",
    type: "text",
    name: "name",
    placeholder: "Ваше имя",
    value: "",
    required: true,
  },
};

export const WithValue: Story = {
  args: {
    label: "Введите имя",
    id: "name",
    type: "text",
    name: "name",
    placeholder: "Ваше имя",
    value: "Иван Иванов",
    required: false,
  },
};
