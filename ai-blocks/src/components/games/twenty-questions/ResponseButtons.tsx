// src/components/games/twenty-questions/ResponseButtons.tsx

interface ResponseButtonsProps {
  onResponse: (answer: 'yes' | 'no' | 'maybe') => void;
  disabled: boolean;
}

export default function ResponseButtons({ onResponse, disabled }: ResponseButtonsProps) {
  const buttons = [
    {
      answer: 'yes' as const,
      label: '✅ Yes',
      bgColor: 'bg-green-500 hover:bg-green-600',
      disabledColor: 'bg-green-300'
    },
    {
      answer: 'no' as const,
      label: '✕ No',
      bgColor: 'bg-red-500 hover:bg-red-600',
      disabledColor: 'bg-red-300'
    },
    {
      answer: 'maybe' as const,
      label: '🤷 Maybe',
      bgColor: 'bg-yellow-500 hover:bg-yellow-600',
      disabledColor: 'bg-yellow-300'
    }
  ];

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {buttons.map((button) => (
          <button
            key={button.answer}
            onClick={() => onResponse(button.answer)}
            disabled={disabled}
            className={`
              ${disabled ? button.disabledColor : button.bgColor}
              text-white font-semibold py-4 px-4 rounded-lg text-base md:text-lg
              transition-all duration-200 transform
              ${disabled ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              shadow-lg flex items-center justify-center text-center
              min-h-[60px] whitespace-nowrap
            `}
          >
            <span className="block">{button.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}