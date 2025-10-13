import './FooterStyles.css';

function Footer({ text='string' }) {
  return (
    <footer className='footer'>
      <p>{text}</p>
    </footer>
  );
}

export default Footer;