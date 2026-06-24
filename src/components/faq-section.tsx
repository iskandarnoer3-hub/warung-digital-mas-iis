'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Bagaimana cara memesan jasa?',
    answer:
      'Anda bisa langsung chat via web kami atau hubungi via WhatsApp di 0882-0008-58698. Tim kami akan merespons dan memproses pesanan Anda dengan cepat.',
  },
  {
    question: 'Apakah ada garansi untuk jasa yang diberikan?',
    answer:
      'Ya! Kami memberikan garansi hingga 30 hari untuk sebagian besar jasa kami. Jika ada masalah setelah layanan selesai, Anda bisa menghubungi kami untuk perbaikan tanpa biaya tambahan.',
  },
  {
    question: 'Berapa lama proses pengerjaan?',
    answer:
      'Waktu pengerjaan tergantung jenis jasa. Untuk servis laptop biasanya 1-3 hari kerja, bimbingan skripsi sesuai kesepakatan, dan jasa lainnya akan diinformasikan saat konsultasi.',
  },
  {
    question: 'Apakah bisa melayani area di luar Cirebon?',
    answer:
      'Untuk jasa yang memerlukan kehadiran langsung, kami melayani area Cirebon dan sekitarnya. Namun untuk jasa seperti konsultasi, bimbingan skripsi, dan desain digital, kami bisa melayani secara online dari mana saja.',
  },
  {
    question: 'Bagaimana sistem pembayarannya?',
    answer:
      'Kami menerima pembayaran via transfer bank BCA saja, dan bisa juga bayar di tempat untuk area Cirebon.',
  },
  {
    question: 'Apakah chat AI bisa menjawab semua pertanyaan?',
    answer:
      'AI kami dilatih khusus untuk menjawab pertanyaan seputar jasa dan layanan kami. Untuk pertanyaan yang memerlukan penanganan khusus, AI akan mengarahkan Anda ke tim profesional kami via WhatsApp.',
  },
  {
    question: 'Apa saja jasa yang tersedia?',
    answer:
      'Kami menyediakan 17 jasa meliputi servis laptop, bimbingan skripsi/tesis/disertasi, cek Turnitin & AI, jahit borongan, desain grafis, agency acara, MC profesional, gambus & sound system, website, konsultan manajemen, copywriting, kaligrafi, pigura custom, hias taman, angklung, dan kambing qurban.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Pertanyaan Umum
        </h2>
        <p className="text-zinc-400">
          Jawaban atas pertanyaan yang sering ditanyakan
        </p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-zinc-800"
            >
              <AccordionTrigger className="text-white hover:text-violet-400 hover:no-underline text-sm sm:text-base text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
