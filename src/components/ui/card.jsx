import React from 'react';
const cx=(...a)=>a.filter(Boolean).join(' ');
export function Card({ className, as:Tag='div', ...p }){ return <Tag className={cx('cc-card',className)} {...p}/>; }
export function CardHeader({ className, as:Tag='div', ...p }){ return <Tag className={cx('cc-card__header',className)} {...p}/>; }
export function CardTitle({ className, as:Tag='h3', ...p }){ return <Tag className={cx('cc-card__title',className)} {...p}/>; }
export function CardDescription({ className, as:Tag='p', ...p }){ return <Tag className={cx('cc-card__desc',className)} {...p}/>; }
export function CardContent({ className, as:Tag='div', ...p }){ return <Tag className={cx('cc-card__content',className)} {...p}/>; }
export function CardFooter({ className, as:Tag='div', ...p }){ return <Tag className={cx('cc-card__footer',className)} {...p}/>; }
if(typeof document!=='undefined' && !document.getElementById('cc-card-style')){
  const s=document.createElement('style'); s.id='cc-card-style';
  s.textContent=`.cc-card{border:1px solid #e5e7eb;border-radius:12px;background:#fff}
.cc-card__header{padding:12px 16px;border-bottom:1px solid #f3f4f6}
.cc-card__title{margin:0;font-size:1.1rem;font-weight:600}
.cc-card__desc{margin:6px 0 0;color:#6b7280;font-size:.9rem}
.cc-card__content{padding:16px}
.cc-card__footer{padding:12px 16px;border-top:1px solid #f3f4f6}`;
  document.head.appendChild(s);
}
