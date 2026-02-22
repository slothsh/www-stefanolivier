import { type IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export {};

declare global {
    type SrcMail = `mailto:${string}@${string}.${'com' | 'co.za' | 'net'}`;
    type SrcWeb = `${'https' | 'http'}://${string}`;
    type SrcTel = `tel:${string}`;

    type Contact = 'LinkedIn' | 'GitHub' | 'Email' | 'Phone';

    type ContactIcon = {
        [K in Contact]: IconDefinition
    }

    type ContactItem = {
        src: SrcMail | SrcWeb | SrcTel,
        icon: IconDefinition,
        displayName: string,
    }

    interface Bio {
        firstname: string,
        surname: string,
        about: string,
        occupation: string,
        contact: { [K in Contact]: ContactItem },
        name: string,
        avatarUrl: SrcWeb | `/${string}`,
    }

    var Bio: Bio;
}

(globalThis as any).Bio = {
    firstname: 'Stefan',
    surname: 'Olivier',
    about: 'I make websites and applications that have the happiest bits, nibbles, and bytes.',
    occupation: 'Software Engineer',
    avatarUrl: 'https://stefanolivier.imgix.net/img/owlsh.jpg',
    contact: {
        Phone: {
            icon: faPhone,
            src: 'tel:+27761855537',
            displayName: '+27 76 185 5537',
        },
        Email: {
            icon: faEnvelope,
            src: 'mailto:s.olivier1194@gmail.com',
            displayName: 's.olivier1194@gmail.com',
        },
        GitHub: {
            icon: faGithub,
            src: 'https://github.com/slothsh',
            displayName: '/slothsh',
        },
        LinkedIn: {
            icon: faLinkedin,
            src: 'https://linkedin.com/in/stefan-olivier-628261145',
            displayName: 'Stefan Olivier',
        },
    },
};

Object.defineProperty(globalThis.Bio, 'name', {
    get() {
        return [this.firstname, this.surname].join(' ');
    }
});
