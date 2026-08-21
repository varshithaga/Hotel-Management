import { useRef, useState, type FormEvent } from 'react';

export function useDemoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    formRef.current?.reset();
    successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  return { formRef, successRef, submitted, handleSubmit };
}
