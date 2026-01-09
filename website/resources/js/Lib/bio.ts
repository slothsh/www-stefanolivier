import { type IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export {};

declare global {
    type SrcMail = `mailto:${string}@${string}.${'com' | 'co.za' | 'net'}`;
    type SrcWeb = `${'https' | 'http'}://${string}`;

    type Contact = 'LinkedIn' | 'GitHub' | 'Instagram' | 'Email';

    type ContactIcon = {
        [K in Contact]: IconDefinition
    }

    type ContactItem = {
        src: SrcMail | SrcWeb,
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
    avatarUrl: '/images/avatar.png',
    contact: {
        Email: {
            icon: faEnvelope,
            src: 'mailto:dev@stefanolivier.com',
            displayName: 'dev@stefanolivier.com',
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
        Instagram: {
            icon: faInstagram,
            src: 'https://instagram.com/@stefan_is_stevey',
            displayName: '@stefan_is_stevey',
        }
    },
};

Object.defineProperty(globalThis.Bio, 'name', {
    get() {
        return [this.firstname, this.surname].join(' ');
    }
});
