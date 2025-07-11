import { Container, Section } from "~/components/blocks";
import { GithubIcon } from "~/components/icons/github";
import { TwitterIcon } from "~/components/icons/twitter";

export const Footer = () => {
  return (
    <footer className="mt-32">
      <Section>
        <Container className="not-prose flex flex-col md:flex-row md:gap-2 gap-6 justify-between md:items-center">
          <div className="flex gap-4">
            <a href="https://github.com/ephraimduncan" target="_blank">
              <GithubIcon />
            </a>
            <a href="https://x.com/ephraimduncan" target="_blank">
              <TwitterIcon />
            </a>
          </div>
          <p className="text-muted-foreground">
            © <a href="https://duncan.land">Ephraim Duncan</a>. All rights
            reserved. 2024-present.
          </p>
        </Container>
      </Section>
    </footer>
  );
};
