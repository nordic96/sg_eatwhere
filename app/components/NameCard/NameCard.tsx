import Home from '@mui/icons-material/Home';
import Image from 'next/image';

export default function NameCard() {
  return (
    <div className={'py-2 flex grow gap-1 items-center'}>
      <a href={'https://www.linkedin.com/in/gi-hun-ko-863619184/'} target={'_blank'}>
        <Image
          src={'/brands/InBug-Black.png'}
          className={'w-6 h-5'}
          width={'0'}
          height={'0'}
          alt={'linkedin'}
        />
      </a>
      <a href={'https://github.com/nordic96'} target={'_blank'}>
        <Image
          src={'/brands/github-mark.svg'}
          className={'w-5'}
          alt={'github'}
          width={'0'}
          height={'0'}
        />
      </a>
      <a href={'https://stephenghk.com'} target={'_blank'}>
        <Home />
      </a>
    </div>
  );
}
