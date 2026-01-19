import ErrorIcon from '@/icons/ErrorIcon';

const errors = [
  'Трасьця… щось пішло не так. Уже дивимось.',
  'Ой! Помилка вискочила зненацька. Розбираємось.',
  'Щось ми тут спіткнулись. Скоро полагодимо.',
  'Халепа, мілорд. Код вирішив пожартувати.',
  'Помилка. Так, знову вона. Ми вже з нею говоримо.',
  'Сталась технічна негода. Інженери вже в бою.',
  'Система захиталась, та встоїть.',
  'Тимчасова халепа, не здаємось.',
];

const ErrorText = () => {
  const randomExeptionText = Math.floor(Math.random() * errors.length);

  return (
    <div className="flex justify-center grow items-center">
      <div className="flex flex-col items-center justify-center w-1/2  gap-6">
        <div>
          <ErrorIcon />
        </div>
        <p>{errors[randomExeptionText]}</p>
      </div>
    </div>
  );
};

export default ErrorText;
