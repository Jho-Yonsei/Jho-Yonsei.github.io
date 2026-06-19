#!/usr/bin/env ruby

require "rbconfig"

project_root = File.expand_path(__dir__)
jekyll_args = [
  "serve",
  "--source", project_root,
  "--config", File.join(project_root, "_config.yml") + "," + File.join(project_root, "_config.dev.yml")
]

candidates = []

rbenv_root = ENV.fetch("RBENV_ROOT", File.expand_path("~/.rbenv"))
version_file = File.join(project_root, ".ruby-version")

if File.file?(version_file)
  version = File.read(version_file).strip
  bin_dir = File.join(rbenv_root, "versions", version, "bin")
  candidates << [File.join(bin_dir, "ruby"), File.join(bin_dir, "jekyll")]
end

begin
  candidates << [RbConfig.ruby, Gem.bin_path("jekyll", "jekyll")]
rescue Gem::GemNotFoundException
  # The active Ruby may not be the rbenv Ruby that owns the project gems.
end

Dir.glob(File.join(rbenv_root, "versions", "*", "bin", "jekyll")).reverse_each do |jekyll|
  ruby = File.join(File.dirname(jekyll), "ruby")
  candidates << [ruby, jekyll] if File.executable?(ruby)
end

ruby, jekyll = candidates.find { |candidate| File.file?(candidate[1]) }

unless ruby && jekyll
  abort "Jekyll is not installed. Install it with: gem install jekyll -v 3.10.0"
end

Dir.chdir(project_root)
ENV.delete("GEM_HOME")
ENV.delete("GEM_PATH")
exec ruby, jekyll, *jekyll_args
