import { Permit } from "permitio";

export const permit = new Permit({
  pdp: "http://localhost:7766",
  token:
    "permit_key_BVteG96bKI9Ru4CPmgKZgdIAHBo909agAoPBer1eRQjwC83em8L9LlM3GvNjD40Oi1OLJu5e6GzUJa3exQX9Gu",
  log: {
    level: "debug",
  },
});
