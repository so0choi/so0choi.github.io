#!/usr/bin/env perl
use strict;
use warnings;

my $file = shift @ARGV or die "Usage: $0 <file>\n";

local $/ = undef;
open my $fh, '<', $file or die "Cannot read $file: $!";
my $content = <$fh>;
close $fh;

# Replace @assets/posts/... and ../../../../../assets/posts/... with ./<filename>
$content =~ s{\((?:\s*)\@assets/posts/.*/([^/()]+\.(?:png|jpe?g|gif|svg|PNG))\)}{(./$1)}g;
$content =~ s{\(\.{0,2}(?:/\.\.)*/assets/posts/.*/([^/()]+\.(?:png|jpe?g|gif|svg|PNG))\)}{(./$1)}g;

# Update heroImage in frontmatter
$content =~ s{(heroImage:\s*[\"\'])\@assets/posts/.*/([^\"\']+\.(?:png|jpe?g|gif|svg|PNG))(\1?)}{$1./$2$3}g;
$content =~ s{(heroImage:\s*[\"\'])\.{0,2}(?:/\.\.)*/assets/posts/.*/([^\"\']+\.(?:png|jpe?g|gif|svg|PNG))(\1?)}{$1./$2$3}g;

open my $oh, '>', $file or die "Cannot write $file: $!";
print $oh $content;
close $oh;

exit 0;

