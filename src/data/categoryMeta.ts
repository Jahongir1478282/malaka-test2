import type { CategoryKey } from "./questions";

export type CategoryMeta = {
  key: CategoryKey;
  title: string;
  description: string;
  icon: string;
};

export const categories: CategoryMeta[] = [
  {
    key: "category0",
    title: "AKT zamonaviy yutuqlari",
    description: "Bulutli texnologiyalar va axborot xizmatlari haqida",
    icon: "📱"
  },
  {
    key: "category1",
    title: "AKT dolzarb muammolari",
    description: "Muhim muammolar va ularning yechimlari",
    icon: "💻"
  },
  {
    key: "category2",
    title: "Taraqqiyot strategiyasi",
    description: "Innovatsion rivojlanish yo'nalishlari",
    icon: "🚀"
  },
  {
    key: "category3",
    title: "Ta'lim sifati",
    description: "Ta'lim tizimini baholash savollari",
    icon: "📊"
  },
  {
    key: "category4",
    title: "Pedagogik kompetensiyalar",
    description: "XXI asr o'qituvchisi uchun talablar",
    icon: "👨‍🏫"
  },
  {
    key: "category5",
    title: "Raqamli kompetensiyalar",
    description: "Texnik ko'nikmalar va vositalar",
    icon: "🌐"
  },
  {
    key: "category6",
    title: "Huquqiy asoslar",
    description: "Normativ hujjatlar va me'yorlar",
    icon: "⚖️"
  },
  {
    key: "category7",
    title: "Ilmiy-innovatsion faoliyat",
    description: "Tadqiqotlar va yangiliklar",
    icon: "🔬"
  }
];
