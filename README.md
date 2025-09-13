# متجر الإلكترونيات

تطبيق ويب لمتجر إلكترونيات مبني باستخدام React و Vite.

## التشغيل المحلي

```bash
# تثبيت التبعيات
pnpm install

# تشغيل خادم التطوير
pnpm run dev

# بناء المشروع للإنتاج
pnpm run build
```

## النشر على Vercel

1. ارفع المشروع إلى GitHub
2. اربط المستودع بـ Vercel
3. تأكد من أن إعدادات البناء كالتالي:
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

## الميزات

- واجهة مستخدم حديثة ومتجاوبة
- مكونات UI من Radix UI
- تصميم باستخدام Tailwind CSS
- تنقل سلس باستخدام React Router
- رسوم بيانية باستخدام Recharts
- رسوم متحركة باستخدام Framer Motion

